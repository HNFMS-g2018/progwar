#!/usr/bin/perl
#打印地图。

use strict;
use warnings;
use File::Basename qw/dirname/;
use List::Util qw/shuffle/;

chdir(dirname($0) . "/info");

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

my ($mph, $mpw, @mp) = read_matrix("map");
my ($unn, $uns, @un) = read_matrix("unit");

for my $i (@un) {
	my @arr = @{$i};
	$mp[$arr[2]][$arr[3]] = "\e[1;36m$arr[0]\e[0m";
}

for my $i (0 .. $mph - 1) {
	printf("%s\n", join(' ', @{$mp[$i]}));
}
