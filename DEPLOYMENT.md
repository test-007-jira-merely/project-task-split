# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm installed (or npm/yarn)

## Backend Deployment

### Option 1: Docker (Recommended)

```bash
# Build backend image
docker build -t meal-platform-backend -f apps/backend/Dockerfile .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/dbname" \
  -e PORT=3000 \
  -e NODE_ENV=production \
  meal-platform-backend
```

### Option 2: Manual Deployment

```bash
# Install dependencies (from root)
pnpm install

# Generate Prisma client
cd apps/backend
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed database (first time only)
pnpm prisma db seed

# Build backend
pnpm build

# Start production server
pnpm start:prod
```

### Environment Variables (Backend)

Create `.env` file in `apps/backend`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
PORT=3000
FRONTEND_URL="https://your-frontend-url.com"
NODE_ENV="production"
```

## Frontend Deployment

### Build for Production

```bash
# From root
pnpm install

# Build frontend
cd apps/frontend
pnpm build
```

The built files will be in `apps/frontend/dist/`.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from apps/frontend)
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy (from apps/frontend)
netlify deploy --prod --dir=dist
```

### Environment Variables (Frontend)

Set these environment variables in your hosting platform:

```env
VITE_API_URL="https://your-backend-url.com/api"
```

For local development, create `.env.local` in `apps/frontend`:

```env
VITE_API_URL="http://localhost:3000/api"
```

## Database Hosting Options

### Supabase (Recommended for free tier)
1. Create a new project at https://supabase.com
2. Get the connection string from Settings > Database
3. Use the connection pooler URL for better performance

### Railway
1. Create a new project at https://railway.app
2. Add a PostgreSQL database
3. Copy the DATABASE_URL from the connection info

### Neon (Serverless PostgreSQL)
1. Create a new project at https://neon.tech
2. Get the connection string
3. Supports autoscaling and serverless

### AWS RDS (Production)
1. Create a PostgreSQL RDS instance
2. Configure security groups for access
3. Get connection string from AWS Console

## Recommended Deployment Stack

### For Hobbyist/Free Tier:
- **Backend**: Railway / Render Free Tier
- **Frontend**: Vercel / Netlify
- **Database**: Supabase Free Tier

### For Production:
- **Backend**: AWS ECS / Google Cloud Run / Railway Pro
- **Frontend**: Vercel Pro / Netlify
- **Database**: AWS RDS / Supabase Pro / Neon

## Post-Deployment Checklist

- [ ] Backend is accessible and returns 200 on `/health` endpoint
- [ ] Database migrations have been applied successfully
- [ ] Database has been seeded with initial recipes
- [ ] Frontend can connect to backend API
- [ ] CORS is configured correctly on backend
- [ ] Environment variables are set correctly
- [ ] SSL/HTTPS is enabled on both frontend and backend
- [ ] Error logging is configured (optional: Sentry)
- [ ] Monitoring is set up (optional: Datadog, New Relic)

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Verify database is accessible from backend server
- Check Prisma migrations are applied: `pnpm prisma migrate status`

### Frontend can't connect to backend
- Verify VITE_API_URL is set correctly
- Check CORS settings on backend
- Test backend endpoint directly with curl

### Database connection errors
- Check connection string format
- Verify database credentials
- Check firewall/security group settings
- Try connection pooling (e.g., PgBouncer)

## Performance Tips

1. **Enable caching**: Use Redis for frequently accessed data
2. **Database indexing**: Ensure proper indexes on Prisma schema
3. **CDN**: Use Vercel/Netlify CDN for frontend assets
4. **Image optimization**: Use next-gen formats (WebP)
5. **API rate limiting**: Implement rate limiting on backend

## Monitoring

### Health Check Endpoint
```bash
curl https://your-backend-url.com/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": {
      "status": "up"
    }
  }
}
```

## Scaling Considerations

- Use horizontal scaling for backend (multiple instances)
- Enable database connection pooling
- Consider implementing caching layer (Redis)
- Use CDN for static assets
- Monitor performance with APM tools
