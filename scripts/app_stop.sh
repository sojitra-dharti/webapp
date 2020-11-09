#!/bin/bash

PID=`ps -eaf | grep "node server.js" | grep -v grep | awk '{print $2}'`

if [[ "" !=  "$PID" ]]; then
  sudo kill -9 $PID
fi
