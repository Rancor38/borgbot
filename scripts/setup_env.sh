#!/bin/bash
set -e  # Exit on error

# Configure AWS CLI with the region
aws configure set region us-west-1 

# Path to the borgbot secrets in Secrets Manager
SECRET_ID="Borgbot_Secrets"

# Retrieve secrets as JSON
secrets_json=$(aws secretsmanager get-secret-value --secret-id "$SECRET_ID" --region us-east-1 --query SecretString --output text)

if [ -z "$secrets_json" ]; then
  echo "No secrets found for Borgbot."
  exit 1
fi

# Parse JSON and write to .env
echo "$secrets_json" | jq -r 'to_entries | map("\(.key)=\(.value|tostring)") | .[]' > /home/ec2-user/borgbot/.env

# Set permissions
chmod 600 /home/ec2-user/borgbot/.env

echo "Borgbot .env file created successfully."