#!/bin/bash
set -e
cd /home/ubuntu/Nidhi-Bank-API
npm install
npm run build
pm2 stop all
pm2 start ecosystem.config.js
