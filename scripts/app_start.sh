#!/bin/bash

sudo chmod 777 /home/ubuntu/webapp
sudo chmod 777 /home/ubuntu/webapp/webappBackend
sudo chmod 777 /home/ubuntu/webapp/webappBackend/logs
sudo chmod 777 /home/ubuntu/webapp/webappBackend/logs/csye6225.log
cd /home/ubuntu/webapp/webappBackend

sudo nohup node server.js >> debug.log 2>&1 &