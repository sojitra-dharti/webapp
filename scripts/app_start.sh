#!/bin/bash

cd /home/ubuntu/webapp/webappBackend
sudo chmod 666 /opt/csye6225.log
sudo nohup node server.js >> debug.log 2>&1 &