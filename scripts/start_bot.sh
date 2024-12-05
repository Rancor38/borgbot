#!/bin/bash
set -e  # Exit on error

# Set working directory
cd /home/ec2-user/borg-bot || exit 1

# Create logs directory with proper permissions
mkdir -p logs
chmod 755 logs

# Check if PM2 process exists and remove it
if pm2 list | grep -q "borg-bot"; then
    pm2 delete borg-bot
fi

# Start new PM2 process with logging
pm2 start app.js --name borg-bot --log ./logs/app.log

# Ensure process started successfully
if ! pm2 list | grep -q "borg-bot"; then
    echo "Failed to start borg-bot process"
    exit 1
fi

echo "borg-bot started successfully"