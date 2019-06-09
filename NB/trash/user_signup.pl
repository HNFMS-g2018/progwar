#!/usr/bin/perl
# 因为不打算支持用户姓名，所以这个脚本被扔进了 trash 。

use strict;
use warnings;
use File::Basename qw/dirname/;

chdir(dirname($0));
my $dbfile = 'info/user.txt';
mkdir("info") unless (-d "info");

sub read_info_file()
{
	my @user_info;
	my $info_file;

	open($info_file, "<", "$dbfile")
		or return ();
	push(@user_info, [split(' ')]) while (<$info_file>);
	close($info_file);

	return @user_info;
}

sub write_info_file
{
	my $info_file;
	my @user_info = @_;

	open($info_file, ">", "$dbfile")
		or die("Cannot open $dbfile for writing");
	print $info_file (join(' ', @{shift(@user_info)}) . "\n") while (@user_info);
	close($info_file);
}

my $name = shift();
die("User name must not be empty") unless ($name);

my @user_info = read_info_file();
die("Same user name") if (grep({ $_->[0] eq $name} @user_info));

# user_info 数组在创建时就已经保持完全有序。所以最后一个 id 就是 last_user_id 。
my $last_user_id = (@user_info) ?  ($user_info[scalar(@user_info) - 1]->[1]) : (0);
push(@user_info, [ $name, $last_user_id + 1]);

write_info_file(@user_info);
