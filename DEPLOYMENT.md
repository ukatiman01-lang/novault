# 🚀 Deployment Guide

## Prerequisites

### On Your Local Machine
- Docker Desktop installed
- SSH key for VPS access
- `rsync` installed (for Linux/Mac; Windows users can use WSL2)

### On Your VPS
- Ubuntu 20.04+ (or any Linux distro)
- Docker & Docker Compose installed
- SSH access enabled

## VPS Setup (One-time only)

### 1. Connect to VPS
```bash
ssh root@YOUR_VPS_IP
```

### 2. Install Docker & Docker Compose
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose (latest)
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 3. Create deployment directory
```bash
mkdir -p /opt/nextjs-app
cd /opt/nextjs-app
```

## Deployment Steps

### Option A: Using Deploy Script (Recommended)

1. **Make script executable**
   ```bash
   chmod +x deploy.sh
   ```

2. **Run deploy script**
   ```bash
   ./deploy.sh YOUR_VPS_IP root ~/.ssh/your_ssh_key
   ```

   Example:
   ```bash
   ./deploy.sh 192.168.1.100 root ~/.ssh/id_rsa
   ```

3. **Access your app**
   ```
   http://YOUR_VPS_IP:8888
   ```

### Option B: Manual Deployment

1. **Copy files to VPS**
   ```bash
   rsync -avz --exclude node_modules --exclude .next --exclude .git . root@YOUR_VPS_IP:/opt/nextjs-app/
   ```

2. **SSH into VPS**
   ```bash
   ssh root@YOUR_VPS_IP
   cd /opt/nextjs-app
   ```

3. **Build and run**
   ```bash
   docker compose up -d --build
   ```

4. **Check status**
   ```bash
   docker compose ps
   docker compose logs -f app
   ```

## Post-Deployment

### View Logs
```bash
ssh root@YOUR_VPS_IP "cd /opt/nextjs-app && docker compose logs -f app"
```

### Update Application
```bash
# Push latest changes locally then run:
./deploy.sh YOUR_VPS_IP root ~/.ssh/your_ssh_key
```

### Stop Application
```bash
ssh root@YOUR_VPS_IP "cd /opt/nextjs-app && docker compose down"
```

### Restart Application
```bash
ssh root@YOUR_VPS_IP "cd /opt/nextjs-app && docker compose restart app"
```

## Reverse Proxy Setup (Optional - for port 80/443)

If you want to access via standard ports (80/443), setup nginx:

### 1. Install Nginx
```bash
apt install nginx -y
```

### 2. Create Nginx config
```bash
sudo nano /etc/nginx/sites-available/nextjs-app
```

Add this config:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable site and test
```bash
ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 4. Setup SSL with Let's Encrypt (Free)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d YOUR_DOMAIN.com
```

## Troubleshooting

### Container won't start
```bash
docker compose logs app
docker compose down
docker system prune
docker compose up -d --build
```

### Port already in use
Change port in docker-compose.yml:
```yaml
ports:
  - "8888:3000"  # Change first number to different port
```

### Check Docker resources
```bash
docker stats
docker system df
```

### SSH connection issues
- Verify SSH key permissions: `chmod 600 ~/.ssh/your_key`
- Check VPS firewall allows port 22
- Verify SSH is running: `systemctl status ssh`

## Environment Variables

If you need environment variables, create `.env.production` in project root before deployment:

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
DATABASE_URL=postgresql://user:pass@db:5432/app
```

Then pass to container in docker-compose.yml:
```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Performance Tips

1. **Enable Docker BuildKit** (faster builds)
   ```bash
   export DOCKER_BUILDKIT=1
   ```

2. **Use Docker image caching**
   ```bash
   docker compose build --no-cache  # only when needed
   ```

3. **Monitor disk space**
   ```bash
   df -h
   docker system prune -a  # cleanup old images
   ```

---

**VPS IP:** (Share your IP when ready)
**Port:** 8888
**Access URL:** http://YOUR_VPS_IP:8888
