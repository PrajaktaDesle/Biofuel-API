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
# Start PM2
pm2 start ecosystem.config.js 2>&1
if [ $? != "0" ]; then
   cat /var/log/deployment-logs/bootscript-log.log;
   error_exit "pm2 start unsuccessful"
else
   echo "PM2 started";
fi
#pm2 stop all --silent 
#pm2 start ecosystem.config.js
