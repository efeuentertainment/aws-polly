#!/bin/bash

#run as root
pkill -x -o -SIGUSR1 -f 'node /usr/local/aws-polly/signal.js -a plughw:1 -m -v Matthew' || node /usr/local/aws-polly/signal.js -a plughw:1 -m -v Matthew &
