# Deployment Guide - MealGen

## Quick Deploy to Popular Platforms

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
npm run build
vercel --prod
```

Or use Vercel's GitHub integration:
1. Push to GitHub
2. Import repository in Vercel dashboard
3. Build command: `npm run build`
4. Output directory: `dist`

### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

Or use Netlify's GitHub integration:
1. Push to GitHub
2. Import repository in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update vite.config.ts:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

4. Deploy:
```bash
npm run deploy
```

### Cloudflare Pages

1. Push to GitHub
2. Create new project in Cloudflare Pages
3. Connect repository
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy

### Docker (Self-hosted)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t mealgen .
docker run -p 80:80 mealgen
```

## Pre-deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] Verify all images load correctly
- [ ] Test theme toggle functionality
- [ ] Test ingredient filtering
- [ ] Test favorites persistence
- [ ] Verify responsive design on mobile
- [ ] Check browser console for errors
- [ ] Ensure TypeScript compiles without errors
- [ ] Run `npm run lint` and fix any issues

## Environment Variables

This app doesn't require environment variables for basic functionality. If you extend it with backend features, create `.env` file:

```
VITE_API_URL=your-api-url
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Performance Optimization

Already implemented:
- ✅ Lazy image loading
- ✅ Code splitting with Vite
- ✅ Optimized bundle size
- ✅ Tree-shaking enabled
- ✅ Minification in production

Optional improvements:
- Add service worker for offline support
- Implement image CDN with optimization
- Add analytics tracking
- Enable gzip/brotli compression

## Custom Domain

After deploying to any platform:

1. Add CNAME record in DNS:
```
Type: CNAME
Name: www (or subdomain)
Value: your-deployment-url.vercel.app
```

2. Configure in platform dashboard:
   - Add custom domain
   - Verify DNS
   - Enable SSL (automatic)

## Monitoring

Recommended services:
- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: Add to `index.html`
- **Sentry**: Error tracking
- **LogRocket**: Session replay

## Troubleshooting

### Build fails with TypeScript errors
```bash
npm run build -- --mode development
# Fix errors shown
```

### Images not loading in production
- Verify image URLs are absolute (https://)
- Check browser console for CORS errors
- Ensure images are accessible publicly

### Theme not persisting
- Check if localStorage is enabled
- Verify browser doesn't block cookies/storage
- Clear browser cache and test

### Blank page after deployment
- Check base URL in vite.config.ts
- Verify dist folder contents
- Check browser console for errors

## Cost Estimates

Free tier available on:
- ✅ Vercel: 100GB bandwidth/month
- ✅ Netlify: 100GB bandwidth/month
- ✅ GitHub Pages: Unlimited for public repos
- ✅ Cloudflare Pages: Unlimited bandwidth

## Support

For deployment issues:
1. Check platform documentation
2. Review build logs
3. Test locally with `npm run preview`
4. Verify all dependencies installed
