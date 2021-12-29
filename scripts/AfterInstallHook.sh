#!/bin/bash
set -e
cd /home/ubuntu/Nidhi-Bank-API
npm install
npm run build
# Kill Pm2 Process
pm2 kill
echo "Kill All Pm2 Process"
# Stop all PM2
pm2 stop all
echo "PM2 Stop All Succesfull"
#pm2 stop all --silent 
#pm2 start ecosystem.config.js
