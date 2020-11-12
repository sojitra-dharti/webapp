#!/bin/bash


if [ -d "logs" ] 
then
    echo "Directory /home/ubuntu/webapp/webappBackend/logs exists." 
else
    sudo mkdir -p logs
    sudo chmod 777 logs
    sudo touch logs/csye6225.log
    sudo chmod 777 logs/csye6225.log
fi


sudo chown ubuntu /home/ubuntu/webapp/webappBackend
sudo chown ubuntu /home/ubuntu/webapp/webappBackend
sudo chown ubuntu /home/ubuntu/webapp/webappBackend/csye6225.log
