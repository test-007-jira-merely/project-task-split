# Deployment Guide - Meal Discovery Platform

## Manual Deployment Instructions

### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- PostgreSQL 14+
- Nginx
- PM2 (for process management)

---

## 1. Server Setup

### Update system
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install pnpm
```bash
npm install -g pnpm
```

### Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install PM2
```bash
npm install -g pm2
```

---

## 2. Database Setup

### Create database and user
```bash
sudo -u postgres psql

CREATE DATABASE meal_discovery;
CREATE USER meal_app WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE meal_discovery TO meal_app;
\q
```

### Configure PostgreSQL for remote connections (if needed)
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

---

## 3. Application Deployment

### Clone repository
```bash
cd /var/www
sudo git clone <your-repo-url> meal-discovery
cd meal-discovery
sudo chown -R $USER:$USER /var/www/meal-discovery
```

### Install dependencies
```bash
pnpm install
```

### Configure environment variables

**Backend:**
```bash
cd apps/backend
cp .env.example .env
nano .env
```

```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://meal_app:your_secure_password@localhost:5432/meal_discovery"
CORS_ORIGIN=https://yourdomain.com
THROTTLE_TTL=60
THROTTLE_LIMIT=100
LOG_LEVEL=info
```

**Frontend:**
```bash
cd apps/frontend
cp .env.example .env
nano .env
```

```env
VITE_API_URL=https://yourdomain.com/api/v1
VITE_APP_NAME=Meal Discovery Platform
```

### Build shared types
```bash
cd packages/shared-types
pnpm build
```

### Setup database
```bash
cd apps/backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### Build backend
```bash
cd apps/backend
pnpm build
```

### Build frontend
```bash
cd apps/frontend
pnpm build
```

---

## 4. PM2 Process Management

### Create PM2 ecosystem file
```bash
cd /var/www/meal-discovery
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'meal-backend',
      cwd: './apps/backend',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_memory_restart: '500M',
    },
  ],
};
```

### Start backend with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Monitor processes
```bash
pm2 status
pm2 logs meal-backend
pm2 monit
```

---

## 5. Nginx Configuration

### Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/meal-discovery
```

```nginx
# Upstream backend servers
upstream backend {
    least_conn;
    server 127.0.0.1:3001;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Frontend static files
    root /var/www/meal-discovery/apps/frontend/dist;
    index index.html;

    # Frontend routes
    location / {
        limit_req zone=general_limit burst=20 nodelay;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api {
        limit_req zone=api_limit burst=10 nodelay;

        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /api/v1/health {
        proxy_pass http://backend;
        access_log off;
    }
}

# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Enable site and restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/meal-discovery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. SSL Certificate (Let's Encrypt)

### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Auto-renewal
```bash
sudo certbot renew --dry-run
```

Certbot automatically adds a cron job for renewal.

---

## 7. Firewall Configuration

### Setup UFW
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## 8. Monitoring & Logging

### Setup log rotation
```bash
sudo nano /etc/logrotate.d/meal-discovery
```

```
/var/www/meal-discovery/apps/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Monitor with PM2
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 9. Database Backups

### Create backup script
```bash
nano /usr/local/bin/backup-meal-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/meal-discovery"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U meal_app meal_discovery | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

```bash
chmod +x /usr/local/bin/backup-meal-db.sh
```

### Setup cron job
```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-meal-db.sh
```

---

## 10. Performance Tuning

### PostgreSQL optimization
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

```
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

```bash
sudo systemctl restart postgresql
```

### Node.js optimization
Set in ecosystem.config.js:
- `instances: 'max'` - Use all CPU cores
- `max_memory_restart: '500M'` - Auto-restart on memory limit

---

## 11. Zero-Downtime Updates

### Update script
```bash
nano /var/www/meal-discovery/deploy.sh
```

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
pnpm install

# Build shared types
cd packages/shared-types && pnpm build && cd ../..

# Build backend
cd apps/backend
pnpm build

# Migrate database
pnpm prisma:migrate

# Reload backend with zero downtime
pm2 reload meal-backend --update-env

# Build frontend
cd ../frontend
pnpm build

echo "✅ Deployment completed!"
```

```bash
chmod +x deploy.sh
```

### Deploy
```bash
cd /var/www/meal-discovery
./deploy.sh
```

---

## 12. Health Checks

### Backend health
```bash
curl https://yourdomain.com/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 123456,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "checks": {
    "database": true,
    "cache": true
  }
}
```

### Setup monitoring alerts
Use services like UptimeRobot, Pingdom, or New Relic for production monitoring.

---

## 13. Troubleshooting

### Check backend logs
```bash
pm2 logs meal-backend
tail -f /var/www/meal-discovery/apps/backend/logs/combined.log
```

### Check Nginx logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check database connections
```bash
sudo -u postgres psql meal_discovery -c "SELECT count(*) FROM pg_stat_activity;"
```

### Restart services
```bash
pm2 restart meal-backend
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

---

## Summary Checklist

- [ ] Server setup complete
- [ ] PostgreSQL installed and configured
- [ ] Application deployed and built
- [ ] PM2 process manager running
- [ ] Nginx configured with SSL
- [ ] Firewall rules set
- [ ] Log rotation configured
- [ ] Database backups scheduled
- [ ] Health checks passing
- [ ] Monitoring alerts setup

---

**Deployment Complete! 🎉**

Your Meal Discovery Platform is now live and ready to scale to millions of users.
