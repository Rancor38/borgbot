#!/bin/bash
set -e  # Exit on error

# Set working directory
cd /home/ec2-user/borgbot || exit 1

# Source NVM to ensure we have access to node/npm/pm2
source ~/.nvm/nvm.sh

# Check if PM2 process exists and remove it
if pm2 list | grep -q "borgbot"; then
    pm2 delete borgbot
fi

# Start new PM2 process with logging
pm2 start app.js --name borgbot

# Ensure process started successfully
if ! pm2 list | grep -q "borgbot"; then
    echo "Failed to start borgbot process"
    exit 1
fi

echo "borgbot started successfully"