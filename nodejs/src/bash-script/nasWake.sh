#!/bin/bash

# Attempts to ping NAS drive - if successful return true; if unsuccessful wait up to
# TIMEOUT number of seconds while pinging; then try to remount drive
# run using dot notation eg:
# $ ./path/to/script/nasWake.sh

NAS_MAC=90:09:D0:22:58:55
NAS_IP=192.168.1.134
TIMEOUT=60

if ping -w1 -s 1 -c 1 $NAS_IP > /dev/null; then
  echo true
else
  echo false
  sudo etherwake -i eth0 $NAS_MAC
  until ! ping -w1 -s 1 -c 1 $NAS_IP & > /dev/null ; [[ "$SECONDS" -gt $TIMEOUT  ]]; do :; done
  sudo mount -a
  echo true
fi
