#!/bin/bash



cd /home/ubuntu/webapp/webappBackend


sudo nohup node server.js >> debug.log 2>&1 &
