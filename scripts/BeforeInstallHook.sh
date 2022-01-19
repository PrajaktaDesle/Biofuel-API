#!/bin/bash
set -e
git stash
npm update -y
pm2 update
aws s3 cp s3://code-deploynidhiapi/secrets/ecosystem.config.js /home/ubuntu/Nidhi-Bank-API/
