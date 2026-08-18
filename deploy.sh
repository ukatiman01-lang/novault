#!/bin/bash

# Deployment script untuk Next.js app ke VPS
# Usage: ./deploy.sh <VPS_IP> <SSH_USER>

VPS_IP=${1:-}
SSH_USER=${2:-root}
SSH_KEY=${3:-~/.ssh/id_rsa}
DEPLOY_DIR="/opt/nextjs-app"

if [ -z "$VPS_IP" ]; then
    echo "Usage: ./deploy.sh <VPS_IP> [SSH_USER] [SSH_KEY_PATH]"
    echo "Example: ./deploy.sh 192.168.1.100 root ~/.ssh/vps_key"
    exit 1
fi

echo "🚀 Starting deployment to $VPS_IP..."

# Step 1: Create deployment directory on VPS
echo "📁 Creating deployment directory..."
ssh -i "$SSH_KEY" "$SSH_USER@$VPS_IP" "mkdir -p $DEPLOY_DIR && cd $DEPLOY_DIR"

# Step 2: Copy docker-compose and Dockerfile
echo "📋 Copying Docker files..."
scp -i "$SSH_KEY" docker-compose.yml "$SSH_USER@$VPS_IP:$DEPLOY_DIR/"
scp -i "$SSH_KEY" Dockerfile "$SSH_USER@$VPS_IP:$DEPLOY_DIR/"

# Step 3: Copy source code (exclude node_modules and .next)
echo "📦 Copying source code..."
rsync -avz -i "$SSH_KEY" \
    --exclude node_modules \
    --exclude .next \
    --exclude .git \
    --exclude dist \
    --exclude .env.local \
    --exclude .DS_Store \
    . "$SSH_USER@$VPS_IP:$DEPLOY_DIR/"

# Step 4: Build and run on VPS
echo "🔨 Building Docker image on VPS..."
ssh -i "$SSH_KEY" "$SSH_USER@$VPS_IP" "cd $DEPLOY_DIR && docker-compose down && docker-compose up -d --build"

# Step 5: Check status
echo "✅ Waiting for container to start..."
sleep 5
ssh -i "$SSH_KEY" "$SSH_USER@$VPS_IP" "cd $DEPLOY_DIR && docker-compose ps"

echo ""
echo "✨ Deployment complete!"
echo "Your app should be accessible at: http://$VPS_IP:8888"
echo ""
echo "📝 Useful commands on VPS:"
echo "  View logs: ssh $SSH_USER@$VPS_IP 'cd $DEPLOY_DIR && docker-compose logs -f app'"
echo "  Stop app: ssh $SSH_USER@$VPS_IP 'cd $DEPLOY_DIR && docker-compose down'"
echo "  Restart: ssh $SSH_USER@$VPS_IP 'cd $DEPLOY_DIR && docker-compose restart app'"
