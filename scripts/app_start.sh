#!/bin/bash

cd /home/ubuntu/webapp/webappBackend

sudo nohup node server.js >> debug.log 2>&1 &
sudo chmod 666 /home/ubuntu/webapp/webappBackend/logs
sudo chmod 666 /home/ubuntu/webapp/webappBackend/logs/csye6225.log