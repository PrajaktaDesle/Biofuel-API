#!/bin/bash
echo "Running Hook: applicationstart.sh"
cd /home/ubuntu/Nidhi-Bank-API
source /etc/profile
# Start PM2
pm2 start ecosystem.config.js 2>&1
if [ $? != "0" ]; then
   cat /var/log/deployment-logs/bootscript-log.log;
   error_exit "pm2 start unsuccessful"
else
   echo "PM2 started";
fi
exit 0
