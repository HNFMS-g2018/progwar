#!/bin/bash

cd "$(dirname "$0")"
while :; do
	./process.pl
	echo '===== M A P ====='
	./print_map.pl
	sleep 0.1s
done
