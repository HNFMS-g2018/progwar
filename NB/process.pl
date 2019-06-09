#!/usr/bin/perl
#处理一个行动回合。

use strict;
use warnings;
use File::Basename qw/dirname/;
use List::Util qw/shuffle/;

chdir(dirname($0));
mkdir("prog") unless (-d "prog");
mkdir("info") unless (-d "info");

sub collect_output
{
	split("\n", readpipe("./collect"));
}

sub read_matrix($)
{
	my $fname = shift();
	my $fd;

	my @matrix;
	my ($height, $width);

	open($fd, "<", $fname);
	($height, $width) = split(' ', <$fd>);
	$matrix[$_] = [split(' ', <$fd>)] for (0 .. $height - 1);
	close($fd);
	return ($height, $width, @matrix);
}

sub write_matrix
{
	my ($fname, $height, $width, @matrix) = @_;
	my $fd;
	open($fd, ">", $fname);
	print $fd ("$height $width\n");
	for my $i (0 .. $height - 1) {
		printf $fd ("%s\n", join(' ', @{$matrix[$i]}));
	}
	close($fd);
}

sub read_list($)
{
	my $fname = shift();
	my $fd;
	my @arr;
	open($fd, "<", $fname)
		or return ();
	@arr = split(' ', <$fd>);
	close($fd);
	return @arr;
}

sub write_list
{
	my ($fname, @list) = @_;
	my $fd;
	open($fd, ">", $fname);
	printf $fd ("%s\n", join(' ', @list));
	close($fd);
}

my ($map_height, $map_width, @map) = read_matrix("info/map");
my ($unit_num, $unit_size, @unit) = (read_matrix("info/unit"));

my @unit_map;
for my $i (0 .. $map_height - 1) {
	for my $j (0 .. $map_width - 1) {
		$unit_map[$i][$j] = 0;
	}
}
$unit_map[$_->[2]][$_->[3]] = $_->[1] for (@unit);

my @action_count;
$action_count[$_->[1]] = 0 for (@unit);

my @uid_pool = read_list("info/uid");

sub new_basic_unit($$$)
{
	my ($oid, $y, $x) = @_;
	my $uid =
	@uid_pool ? shift(@uid_pool) :
	@unit ? $unit[scalar(@unit) - 1]->[1] + 1 :
	1;
	$action_count[$uid] = 0;
	{
		oid => $oid,
		uid => $uid,
		y => $y,
		x => $x,
		energy => 0,
		energy_lmt => 10,
		hp => 10
	}
}

sub distance($$)
{
	my ($u1, $u2) = @_;
	abs($u1->{"x"} - $u2->{"x"}) + abs($u1->{"y"} - $u2->{"y"});
}

sub array2hash
{
	my $arr = shift();
	{
		oid => $arr->[0],
		uid => $arr->[1],
		y => $arr->[2],
		x => $arr->[3],
		energy => $arr->[4],
		energy_lmt => $arr->[5],
		hp => $arr->[6]
	}
}

sub hash2array
{
	my $hash = shift();
	[
		$hash->{"oid"},
		$hash->{"uid"},
		$hash->{"y"},
		$hash->{"x"},
		$hash->{"energy"},
		$hash->{"energy_lmt"},
		$hash->{"hp"},
	]
}

sub edit_unit_array($)
{
	my $u = shift();
	for (@unit) {
		if (@{$_}[1] == $u->{"uid"}) {
			$_ = hash2array($u)
		}
	}
}

sub remove_unit_array($)
{
	my $u = shift();
	my $cnt = 0;
	for (@unit) {
		last if (@{$_}[1] == $u->{"uid"});
		++$cnt;
	}
	splice(@unit, $cnt, 1);
}

sub find_unit($)
{
	my $uid = shift();
	my $arr = (grep({ array2hash($_)->{"uid"} == $uid } @unit))[0];
	return $arr ? array2hash($arr) : undef;
}

sub get_coord_delta
{
	my ($y, $x, $dir) = @_;
	return
	$dir eq 'l' ? ($y, $x - 1) :
	$dir eq 'r' ? ($y, $x + 1) :
	$dir eq 'u' ? ($y - 1, $x) :
	$dir eq 'd' ? ($y + 1, $x) :
	($y, $x);
}

sub can_occupy($$)
{
	my ($y, $x) = @_;
	return undef if (
		$y < 0 or $y >= $map_height or
		$x < 0 or $x >= $map_width or
		$map[$y][$x] == 1 or
		$unit_map[$y][$x] != 0
	);
	return 1;
}

sub move
{
	my $u = shift();
	my ($y, $x) = ($u->{"y"}, $u->{"x"});
	my ($ny, $nx) = get_coord_delta($y, $x, shift());
	if (can_occupy($ny, $nx)) {
		$unit_map[$y][$x] = 0;
		$unit_map[$ny][$nx] = $u->{"uid"};
		($u->{"y"}, $u->{"x"}) = ($ny, $nx);
		edit_unit_array($u);
	}
}

sub fork
{
	my $u = shift();
	my ($y, $x) = ($u->{"y"}, $u->{"x"});
	my ($ny, $nx) = get_coord_delta($y, $x, shift());
	if ($u->{"energy"} and can_occupy($ny, $nx)) {
		--$u->{"energy"};
		edit_unit_array($u);

		my $n = new_basic_unit($u->{"oid"}, $ny, $nx);
		push(@unit, hash2array($n));
		$unit_map[$ny][$nx] = $n->{"uid"};
	}
}

sub pick
{
	my ($u, @cmd) = @_;
	my ($y, $x) = ($u->{"y"}, $u->{"x"});
	if ($map[$y][$x] == 2 && $u->{"energy"} < $u->{"energy_max"}) {
		++$u->{"energy"};
		edit_unit_array($u);
	}
}

sub attack
{
	my $u = shift();
	my $dest = find_unit(shift());
	return undef unless ($dest);
	if (distance($u, $dest) <= 1) {
		--$dest->{"hp"};
		unless ($dest->{"hp"}) {
			remove_unit_array($dest);
			push(@uid_pool, $dest->{"uid"});
		} else {
			edit_unit_array($dest);
		}
	}
}

sub get_process_func
{
	my $action = shift();

	return
	$action eq "move" ? \&move :
	$action eq "fork" ? \&fork :
	$action eq "pick" ? \&pick :
	$action eq "attack" ? \&attack :
	undef;
}

for (shuffle(collect_output())) {
	my @cmd = split(' ');

	my $owner_id = shift(@cmd);
	my $unit_id = shift(@cmd);
	my $action = shift(@cmd);

	my $u = find_unit($unit_id);
	next if (
		!$u ||
		$owner_id != $u->{"oid"} ||
		$action_count[$unit_id] > 0
	);
	get_process_func($action)->($u, @cmd);
	++$action_count[$unit_id];
}

write_matrix("info/map", $map_height, $map_width, @map);
write_matrix("info/unit", scalar(@unit), scalar(@{$unit[0]}), @unit);
write_list("info//uid", @uid_pool);
