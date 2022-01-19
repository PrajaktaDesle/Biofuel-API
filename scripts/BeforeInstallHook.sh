#!/bin/bash
set -e
sudo npm update -y
sudo pm2 update
sudo aws s3 cp s3://code-deploynidhiapi/secrets/ecosystem.config.js /home/ubuntu/Nidhi-Bank-API/
