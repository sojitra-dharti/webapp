#!/bin/bash

cd /home/ubuntu/webapp/webappBackend

if [ -d "logs" ] 
then
    echo "Directory /home/ubuntu/webapp/webappBackend/logs exists." 
else
    sudo mkdir -p logs
    sudo chmod 777 logs
    sudo touch logs/csye6225.log
    sudo chmod 777 logs/csye6225.log
fi

sudo nohup node server.js >> debug.log 2>&1 &
