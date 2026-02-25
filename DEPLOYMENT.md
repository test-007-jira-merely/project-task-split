# Deployment Guide

Complete guide for deploying the Meal Discovery Platform to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Production Checklist](#production-checklist)
- [Monitoring & Health Checks](#monitoring--health-checks)

## Prerequisites

### Required Software

- **Node.js**: 20.x or higher
- **PostgreSQL**: 16.x or higher
- **npm**: 10.x or higher
- **Git**: For version control

### Recommended Infrastructure

- **Backend**: 1 GB RAM minimum, 2 GB recommended
- **Database**: PostgreSQL managed service (AWS RDS, DigitalOcean Managed Database, etc.)
- **Frontend**: CDN-enabled static hosting

## Environment Variables

### Backend (.env)

Create a `.env` file in `packages/backend/`:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"

# Server Configuration
PORT=3001
NODE_ENV=production

# Logging
LOG_LEVEL=info

# CORS (Frontend URL)
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Frontend (.env)

Create a `.env` file in `packages/frontend/`:

```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
```

## Database Setup

### 1. Create PostgreSQL Database

```sql
CREATE DATABASE meal_platform;
CREATE USER meal_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE meal_platform TO meal_user;
```

### 2. Run Migrations

```bash
cd packages/backend
npx prisma migrate deploy
```

### 3. Seed Database

```bash
npx prisma db seed
```

This will populate the database with 100+ diverse meal recipes.

### 4. Verify Database

```bash
npx prisma studio
```

## Backend Deployment

### Option 1: Docker (Recommended)

#### Create Dockerfile

Create `packages/backend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy root package files for workspace setup
COPY package*.json ./
COPY tsconfig.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy backend package
COPY packages/backend ./packages/backend

# Install dependencies
RUN npm ci --workspace=packages/backend --workspace=packages/shared

# Build shared package
RUN npm run build --workspace=packages/shared

# Build backend
RUN npm run build --workspace=packages/backend

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "run", "start:prod", "--workspace=packages/backend"]
```

#### Build and Run

```bash
# Build image
docker build -t meal-platform-backend -f packages/backend/Dockerfile .

# Run container
docker run -d \
  -p 3001:3001 \
  --env-file packages/backend/.env \
  --name meal-backend \
  meal-platform-backend
```

### Option 2: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create meal-platform-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set LOG_LEVEL=info

# Deploy
git subtree push --prefix packages/backend heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Seed database
heroku run npx prisma db seed
```

### Option 3: AWS EC2

#### Setup EC2 Instance

1. Launch Ubuntu 22.04 instance (t2.small or larger)
2. Configure security groups:
   - Allow SSH (22) from your IP
   - Allow HTTP (80) and HTTPS (443) from anywhere
   - Allow custom TCP (3001) from frontend server

#### Install Dependencies

```bash
# SSH into instance
ssh ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

#### Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/meal-platform.git
cd meal-platform

# Install dependencies
npm install

# Build backend
npm run build:backend

# Setup database (if PostgreSQL on same server)
sudo -u postgres psql
# ... create database and user

# Run migrations
cd packages/backend
npx prisma migrate deploy
npx prisma db seed

# Start with PM2
pm2 start npm --name "meal-backend" -- run start:prod
pm2 save
pm2 startup
```

#### Setup Nginx Reverse Proxy

```bash
sudo apt install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/meal-backend
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/meal-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Option 4: DigitalOcean App Platform

1. Connect GitHub repository
2. Configure app:
   - **Build Command**: `cd packages/backend && npm install && npm run build`
   - **Run Command**: `cd packages/backend && npm run start:prod`
   - **Port**: 3001
3. Add PostgreSQL database addon
4. Set environment variables in dashboard
5. Deploy

## Frontend Deployment

### Build Frontend

```bash
cd packages/frontend
npm install
npm run build
```

Output will be in `packages/frontend/dist/`

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd packages/frontend
vercel --prod
```

Configure in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://api.yourdomain.com"
  }
}
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd packages/frontend
netlify deploy --prod --dir=dist
```

Configure in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://api.yourdomain.com"
```

### Option 3: AWS S3 + CloudFront

#### Create S3 Bucket

```bash
aws s3 mb s3://meal-platform-frontend
aws s3 website s3://meal-platform-frontend --index-document index.html
```

#### Upload Build

```bash
cd packages/frontend
aws s3 sync dist/ s3://meal-platform-frontend --acl public-read
```

#### Create CloudFront Distribution

1. Go to AWS CloudFront console
2. Create distribution with S3 bucket as origin
3. Configure custom error response: 404 → /index.html (for SPA routing)
4. Add custom domain and SSL certificate

### Option 4: Nginx Static Hosting

```bash
# Build frontend locally
cd packages/frontend
npm run build

# Copy to server
scp -r dist/* user@server:/var/www/meal-platform/

# Configure nginx
sudo nano /etc/nginx/sites-available/meal-frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/meal-platform;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Cache static assets
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/meal-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com
```

## Production Checklist

### Security

- [ ] All environment variables configured
- [ ] Database credentials secured (not in code)
- [ ] SSL/TLS certificates installed
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled (backend already configured)
- [ ] Security headers enabled (X-Frame-Options, CSP, etc.)
- [ ] No sensitive data in logs
- [ ] Database backups configured
- [ ] Firewall rules configured

### Performance

- [ ] Database indexes created (via Prisma schema)
- [ ] Response compression enabled
- [ ] Static assets cached with long TTL
- [ ] CDN configured for frontend
- [ ] Database connection pooling enabled
- [ ] API response caching implemented where appropriate

### Monitoring

- [ ] Health check endpoint responding (`/api/health`)
- [ ] Metrics endpoint accessible (`/api/metrics`)
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Log aggregation setup (e.g., CloudWatch, Datadog)
- [ ] Uptime monitoring configured (e.g., UptimeRobot)
- [ ] Performance monitoring (e.g., New Relic, AppDynamics)

### Database

- [ ] Migrations run successfully
- [ ] Database seeded with initial data
- [ ] Automated backups configured
- [ ] Backup restoration tested
- [ ] Database connection limits appropriate for load

### Infrastructure

- [ ] Auto-scaling configured (if using cloud)
- [ ] Load balancer setup (if multiple instances)
- [ ] Disaster recovery plan documented
- [ ] DNS records configured correctly
- [ ] Email/alert notifications setup

## Monitoring & Health Checks

### Health Check Endpoint

```bash
curl https://api.yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-25T10:00:00.000Z",
  "services": {
    "database": "up"
  },
  "version": "1.0.0"
}
```

### Metrics Endpoint

```bash
curl https://api.yourdomain.com/api/metrics
```

Returns performance metrics for all endpoints:
```json
{
  "success": true,
  "data": {
    "endpoints": {
      "/api/dishes/random": {
        "requestCount": 1500,
        "avgResponseTime": 120.5,
        "maxResponseTime": 450,
        "minResponseTime": 45,
        "errorRate": 0.2
      }
    },
    "summary": {
      "totalRequests": 5000,
      "totalErrors": 10,
      "avgResponseTime": 150.3,
      "endpointCount": 5
    }
  }
}
```

### Setting Up Monitoring Alerts

#### Using Uptime Robot (Free Tier)

1. Create HTTP(s) monitor for `https://api.yourdomain.com/api/health`
2. Set check interval to 5 minutes
3. Configure email/SMS alerts

#### Using AWS CloudWatch

```bash
# Create alarm for high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name meal-backend-errors \
  --alarm-description "Alert when error rate is high" \
  --metric-name ErrorCount \
  --namespace AWS/ApiGateway \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs meal-backend

# Common issues:
# - Database connection failed: Check DATABASE_URL
# - Port already in use: Change PORT in .env
# - Missing dependencies: Run npm install
```

### Database Connection Errors

```bash
# Test database connection
npx prisma db push

# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify connection string format
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### High Response Times

1. Check database query performance:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM "Dish" WHERE category = 'lunch';
   ```

2. Enable query logging in PostgreSQL
3. Check metrics endpoint for slow endpoints
4. Consider adding database indexes
5. Implement response caching for expensive queries

### Frontend Not Loading

1. Check browser console for errors
2. Verify VITE_API_URL is correct
3. Check CORS configuration on backend
4. Clear browser cache
5. Verify all static assets are uploaded

## Backup & Recovery

### Database Backup

```bash
# Manual backup
pg_dump -h localhost -U meal_user -d meal_platform > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h localhost -U meal_user -d meal_platform < backup_20260225.sql
```

### Automated Daily Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-meal-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/meal-platform"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -h localhost -U meal_user meal_platform | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-meal-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-meal-db.sh
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (AWS ALB, Nginx)
- Ensure stateless backend (no session storage on server)
- Use managed PostgreSQL with connection pooling
- Consider Redis for session/cache if needed

### Database Optimization

- Monitor slow queries
- Add indexes for frequently queried fields
- Consider read replicas for heavy read loads
- Implement connection pooling (already in Prisma)

### CDN Setup

- Use CloudFront, Cloudflare, or similar
- Cache static assets with long TTL
- Enable gzip/brotli compression
- Use edge locations close to users

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/meal-platform/issues
- Documentation: See README.md and DEVELOPMENT.md
- Health Status: Check `/api/health` endpoint
