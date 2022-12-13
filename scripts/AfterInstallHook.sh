#!/bin/bash
set -e
cd /home/ubuntu/Nidhi-Bank-API
sudo aws s3 cp s3://biofuel-s3/secrets/Dev-Api/.env /home/ubuntu/Biofuel-API/
npm install
npm run build
# Kill Pm2 Process
pm2 kill
echo "Kill All Pm2 Process"
# Stop all PM2
# pm2 stop all
echo "PM2 Stop All Succesfull"
#pm2 stop all --silent 
#pm2 start ecosystem.config.js
