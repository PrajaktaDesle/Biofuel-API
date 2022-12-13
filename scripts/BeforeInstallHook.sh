#!/bin/bash
set -e
sudo npm update -y
sudo pm2 update
sudo aws s3 cp s3://biofuel-s3/secrets/Dev-Api/ecosystem.config.js /home/ubuntu/Nidhi-Bank-API/
#sudo service nginx reload
