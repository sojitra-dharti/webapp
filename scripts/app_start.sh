#!/bin/bash



cd /home/ubuntu/webapp/webappBackend
chmod 777 webappBackend
sudo nohup node server.js >> debug.log 2>&1 &
