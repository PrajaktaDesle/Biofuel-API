#!/bin/bash
set -e
sudo npm update -y
sudo pm2 update
sudo aws s3 cp s3://code-deploynidhiapi/secrets/QA-Nidhi-Api/ecosystem.config.js /home/ubuntu/Nidhi-Bank-API/
sudo aws s3 cp s3://code-deploynidhiapi/secrets/QA-Nidhi-Api/default /etc/nginx/sites-enabled/
sudo service nginx reload
