
pwd
ls -lrt
sudo unzip build_artifact.zip

pwd
ls -lrt
cd ..

sudo cp /home/ubuntu/webapp/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/
x
sleep 3

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
	-a fetch-config -m ec2 \
	-c file:/opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json -s