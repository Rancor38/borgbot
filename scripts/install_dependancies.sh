#!/bin/bash
set -e  # Exit on error

# Update system packages
sudo yum update -y || { echo "Failed to update system packages"; exit 1; }

# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.nvm/nvm.sh

# Install specific Node.js version
nvm install 16 # Or whichever version you need
nvm use 16

# Install git
sudo yum install -y git || { echo "Failed to install git"; exit 1; }

# Install PM2 globally
npm install -g pm2 || { echo "Failed to install PM2"; exit 1; }

# Change ownership of the project directory
sudo chown -R ec2-user:ec2-user /home/ec2-user/borgbot

# Change to application directory
cd /home/ec2-user/borgbot || exit 1

# Install project dependencies
npm install || { echo "Failed to install npm dependencies"; exit 1; }

# Verify installations
node --version
npm --version
git --version
pm2 --version

echo "Dependencies installed successfully"