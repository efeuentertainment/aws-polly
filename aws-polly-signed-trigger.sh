#!/bin/bash

#run as root
if [ $# -eq 0 ]; then
        voice="Matthew"
else
        voice="$1"
fi
#echo 'hello '$voice
pkill -x -o -SIGUSR1 -f '/usr/local/aws-polly-signed-signal -a plughw:1 -m -v '$voice || /usr/local/aws-polly-signed-signal -a plughw:1 -m -v $voice &
