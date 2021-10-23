#!/bin/bash

#run as root
if [ $# -eq 0 ]; then
	voice="Matthew"
else
	voice="$1"
fi
#echo 'hello '$voice
pkill -x -o -SIGUSR1 -f 'node /usr/local/aws-polly/signal.js -a plughw:1 -m -v '$voice || node /usr/local/aws-polly/signal.js -a plughw:1 -m -v $voice &
