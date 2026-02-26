# Deployment Guide

This document provides step-by-step instructions for deploying the Meal Discovery Platform to production.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ database
- pnpm 8+
- Domain name (optional)

## Backend Deployment

### Option 1: Railway.app (Recommended)

Railway provides the easiest deployment experience with built-in PostgreSQL.

1. **Create Railway Account**: https://railway.app

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add PostgreSQL**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically provision a database

4. **Configure Backend Service**:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set Root Directory: `apps/backend`
   - Set Build Command: `pnpm install && pnpm prisma:generate && pnpm build`
   - Set Start Command: `pnpm start:prod`

5. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   API_PREFIX=api/v1
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   CORS_ORIGIN=https://your-frontend-domain.com
   RATE_LIMIT_TTL=60
   RATE_LIMIT_MAX=100
   ```

6. **Run Migrations**:
   - In Railway dashboard, open your backend service
   - Go to "Settings" → "Deploy" → "Custom Start Command"
   - Add migration command: `pnpm prisma:migrate && pnpm prisma:seed && pnpm start:prod`

7. **Get Backend URL**:
   - Railway will provide a public URL (e.g., `https://your-app.up.railway.app`)
   - Note this for frontend configuration

### Option 2: Render.com

1. **Create Render Account**: https://render.com

2. **Create PostgreSQL Database**:
   - Dashboard → "New +" → "PostgreSQL"
   - Choose a plan (free tier available)
   - Note the "Internal Database URL"

3. **Create Web Service**:
   - Dashboard → "New +" → "Web Service"
   - Connect your GitHub repository
   - Set Root Directory: `apps/backend`
   - Environment: Node
   - Build Command: `pnpm install && pnpm prisma:generate && pnpm build`
   - Start Command: `pnpm start:prod`

4. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<your-postgres-internal-url>
   API_PREFIX=api/v1
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

5. **Run Migrations**:
   - After first deploy, go to Shell tab
   - Run: `pnpm prisma:migrate && pnpm prisma:seed`

### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean Account**

2. **Create Managed PostgreSQL Database**:
   - Create → Databases → PostgreSQL
   - Choose a plan
   - Note connection details

3. **Create App**:
   - Apps → Create App
   - Connect GitHub repository
   - Detect `apps/backend` as Node.js service

4. **Configure Build**:
   - Build Command: `pnpm install && pnpm prisma:generate && pnpm build`
   - Run Command: `pnpm start:prod`

5. **Set Environment Variables** (same as above)

6. **Run Migrations** via console

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Create Vercel Account**: https://vercel.com

2. **Import Project**:
   - Dashboard → "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Build Settings**:
   - Framework Preset: Vite
   - Root Directory: `apps/frontend`
   - Build Command: `cd ../.. && pnpm install && cd apps/frontend && pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com/api/v1
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get your deployment URL

### Option 2: Netlify

1. **Create Netlify Account**: https://netlify.com

2. **Import Project**:
   - Sites → "Add new site" → "Import an existing project"
   - Connect GitHub

3. **Configure Build**:
   - Base directory: `apps/frontend`
   - Build command: `pnpm install && pnpm build`
   - Publish directory: `apps/frontend/dist`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com/api/v1
   ```

5. **Configure Redirects**:
   Create `apps/frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

6. **Deploy**

### Option 3: Cloudflare Pages

1. **Create Cloudflare Account**: https://pages.cloudflare.com

2. **Create Project**:
   - Dashboard → "Create a project"
   - Connect GitHub repository

3. **Configure Build**:
   - Framework preset: None
   - Build command: `cd apps/frontend && pnpm install && pnpm build`
   - Build output directory: `apps/frontend/dist`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com/api/v1
   ```

5. **Deploy**

## Post-Deployment Steps

### 1. Verify Backend

Test your backend API:
```bash
curl https://your-backend-url.com/api/v1/health

# Should return:
# {"status":"healthy","timestamp":"...","uptime":123,"version":"1.0.0"}
```

### 2. Test Random Dish:
```bash
curl https://your-backend-url.com/api/v1/dishes/random
```

### 3. Verify Frontend

- Visit your frontend URL
- Test all features:
  - Generate random meal
  - Search recipes
  - Add ingredients and find matches
  - Save favorites
  - View history

### 4. Update CORS

If you encounter CORS errors:
- Update `CORS_ORIGIN` in backend environment variables
- Redeploy backend

### 5. Monitor Performance

- Check backend logs for errors
- Monitor database connections
- Review response times
- Set up error tracking (Sentry, LogRocket, etc.)

## Custom Domain Setup

### Backend (Railway/Render)

1. **Add Custom Domain**:
   - Go to service settings
   - Add your domain (e.g., `api.yourdomain.com`)
   - Update DNS records as instructed

2. **Update CORS**:
   - Update `CORS_ORIGIN` to your frontend domain
   - Redeploy

### Frontend (Vercel/Netlify)

1. **Add Custom Domain**:
   - Go to project settings
   - Add your domain (e.g., `yourdomain.com`)
   - Update DNS records as instructed

2. **SSL Certificate**:
   - Automatically provisioned by platform
   - Wait for DNS propagation (up to 48 hours)

3. **Update API URL**:
   - Update `VITE_API_URL` to your custom backend domain
   - Redeploy

## Environment-Specific Configuration

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong database credentials
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up SSL/TLS certificates
- [ ] Enable database backups
- [ ] Set up monitoring/logging
- [ ] Configure CDN for images (future)
- [ ] Enable compression
- [ ] Set security headers

### Scaling Considerations

**Database:**
- Enable connection pooling (Prisma default)
- Add read replicas for high traffic
- Implement caching (Redis) if needed

**Backend:**
- Scale horizontally by adding more instances
- Use load balancer for multiple instances
- Consider serverless functions for spikes

**Frontend:**
- Leverage platform CDN (automatic on Vercel/Netlify)
- Optimize images with CDN
- Enable service worker for PWA

## Troubleshooting

### Build Failures

**Issue**: `pnpm: command not found`
- **Solution**: Add build command: `npm install -g pnpm && pnpm install`

**Issue**: Prisma client not generated
- **Solution**: Add `pnpm prisma:generate` to build command

**Issue**: Type errors during build
- **Solution**: Ensure all workspace dependencies are installed

### Runtime Errors

**Issue**: Database connection failed
- **Solution**: Verify DATABASE_URL is correct
- Check database is accessible from deployment platform
- Ensure IP whitelist includes deployment platform IPs

**Issue**: CORS errors
- **Solution**: Update CORS_ORIGIN to match frontend domain
- Include `https://` protocol in domain

**Issue**: 404 on frontend routes
- **Solution**: Configure SPA redirects (see platform-specific steps)

### Performance Issues

**Issue**: Slow API responses
- **Solution**: Check database indexes
- Enable query logging to identify slow queries
- Consider caching frequently accessed data

**Issue**: High memory usage
- **Solution**: Optimize Prisma queries
- Implement pagination for large datasets
- Monitor connection pool size

## Monitoring & Maintenance

### Health Checks

Both platforms support health checks:
- Endpoint: `/api/v1/health`
- Expected response: `200 OK`

### Logging

**Backend**: Use platform logging or integrate with:
- Logtail
- Papertrail
- Datadog

**Frontend**: Integrate error tracking:
- Sentry
- LogRocket
- Bugsnag

### Database Backups

**Railway**: Automatic daily backups
**Render**: Automatic backups (paid plans)
**DigitalOcean**: Automatic daily backups

### Updates

1. **Code Updates**: Push to GitHub → auto-deploy
2. **Database Migrations**: Run manually via platform shell
3. **Dependencies**: Update package.json → redeploy

## Cost Estimates

### Free Tier Options

**Railway**:
- $5 credit/month
- ~500 hours of backend runtime
- PostgreSQL included

**Render**:
- Free tier available
- Backend sleeps after inactivity
- Managed PostgreSQL (paid)

**Vercel**:
- 100GB bandwidth/month
- Unlimited deployments
- Custom domains

**Netlify**:
- 100GB bandwidth/month
- 300 build minutes/month

### Paid Plans (Approximate)

- **Backend**: $7-20/month
- **Database**: $7-15/month
- **Frontend**: Usually free with CDN

**Total**: ~$15-35/month for production app

---

For questions or issues, refer to:
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
