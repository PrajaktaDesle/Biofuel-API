#!/bin/bash
echo "Running Hook: applicationstart.sh"
cd /home/ubuntu/teller-install/Server/
source /etc/profile
pm2 start app.js
exit 0
