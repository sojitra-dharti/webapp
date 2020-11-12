#!/bin/bash

sudo chmod 666 /home/ubuntu/webapp
sudo chmod 666 /home/ubuntu/webapp/webappBackend
sudo chmod 666 /home/ubuntu/webapp/webappBackend/logs/csye6225.log
cd /home/ubuntu/webapp/webappBackend

sudo nohup node server.js >> debug.log 2>&1 &