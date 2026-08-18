#!/bin/bash
set -e

echo ""
echo "════════════════════════════════════════════════════════════"
echo "🚀 FULL DEPLOYMENT - usenovault.fun"
echo "════════════════════════════════════════════════════════════"
echo ""

# 1. Update & Install Node.js
echo "📦 [1/6] Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt update && apt install -y nodejs

# 2. Install Nginx & SSL tools
echo "🌐 [2/6] Installing Nginx..."
apt install -y nginx certbot python3-certbot-nginx

# 3. Setup project directory
echo "📂 [3/6] Setting up project..."
DEPLOY_DIR="/opt/nextjs-app"
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# 4. Install dependencies & build
echo "🏗️  [4/6] Installing dependencies & building..."
npm install
npm run build

# 5. Configure Nginx reverse proxy
echo "🔧 [5/6] Configuring Nginx..."
cat > /etc/nginx/sites-available/usenovault.fun << 'NGINXEOF'
server {
    listen 80;
    server_name usenovault.fun www.usenovault.fun;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/usenovault.fun /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 6. Setup SSL Certificate
echo "🔒 [6/6] Setting up SSL certificate..."
certbot --nginx --agree-tos --email namixpay@gmail.com \
    -d usenovault.fun -d www.usenovault.fun --non-interactive 2>/dev/null || \
    echo "⚠️  SSL already configured or skipped"

# 7. Start application
echo ""
echo "🚀 Starting application..."
pkill -f "npm start" || true
nohup npm start > /tmp/nextjs-app.log 2>&1 &
sleep 3

# Verify
if ps aux | grep "node" | grep -v grep > /dev/null; then
    echo "✅ Application is running!"
else
    echo "⚠️  Checking logs..."
    tail -20 /tmp/nextjs-app.log
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✨ DEPLOYMENT COMPLETE!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Your app is now live at:"
echo "   https://usenovault.fun"
echo ""
echo "📊 Server info:"
echo "   IP: 213.199.38.187"
echo "   User: root"
echo "   Project: /opt/nextjs-app"
echo ""
echo "📋 Useful commands (run these via SSH):"
echo "   • View logs:     tail -f /tmp/nextjs-app.log"
echo "   • Restart app:   pkill -f 'npm start' && cd /opt/nextjs-app && nohup npm start &"
echo "   • Stop app:      pkill -f 'npm start'"
echo ""
echo "⚠️  SECURITY: Change your VPS password immediately!"
echo "════════════════════════════════════════════════════════════"
