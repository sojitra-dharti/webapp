#!/bin/bash
cd /home/ubuntu
sudo rm -rf webapp

PID=`ps -eaf | grep "node app.js" | grep -v grep | awk '{print $2}'`

if [[ "" !=  "$PID" ]]; then
  sudo kill -9 $PID
fi

