#!/bin/bash
AWS_ACCESS_KEY="XXXXXXXXXXXXXXXXXXXXX"
AWS_SECRET_KEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
AWS_REGION="XXXXXXXX"

ECR_REPOSITORY_URL="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

sudo apt-get update -y
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo apt-get install -y awscli

aws configure set aws_access_key_id ${AWS_ACCESS_KEY}
aws configure set aws_secret_access_key ${AWS_SECRET_KEY}
aws configure set default.region ${AWS_REGION}
aws configure set default.output json



aws ecr get-login-password --region ${AWS_REGION} | sudo docker login --username AWS --password-stdin ${ECR_REPOSITORY_URL}

# Pull Docker image from ECR
sudo docker pull ${ECR_REPOSITORY_URL}:latest

# Run Docker container
sudo docker run -d -p 3000:8000 ${ECR_REPOSITORY_URL}:latest

