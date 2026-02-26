# Meal Discovery Platform

> Enterprise-grade AI-ready meal discovery platform with intelligent ingredient matching

## 🎯 Overview

A production-ready, full-stack meal discovery application featuring:

- **Random Meal Generator** with weighted randomness and anti-repetition
- **Intelligent Ingredient Matching** with fuzzy logic and substitution support
- **Beautiful Modern UI** with dark/light themes and smooth animations
- **Favorites & History** tracking for personalized experience
- **Scalable Architecture** designed for 1M+ monthly users
- **Clean Code** following industry best practices

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 + TypeScript (Strict Mode)
- Vite for blazing-fast builds
- Tailwind CSS + CSS Variables for theming
- Framer Motion for animations
- Zustand for state management
- TanStack Query (React Query) for API state
- Radix UI for accessible components
- PWA support

**Backend:**
- NestJS (Node.js Framework)
- PostgreSQL database
- Prisma ORM
- TypeScript strict mode
- Class-validator for DTOs
- Helmet + CORS for security
- Rate limiting with throttler

**Shared:**
- Zod for schema validation
- Shared TypeScript types
- Ingredient substitution constants

### Project Structure

```
meal-discovery-platform/
├── apps/
│   ├── frontend/          # React + Vite application
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Page components
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── stores/       # Zustand stores
│   │   │   ├── lib/          # Utilities & API client
│   │   │   └── index.css     # Global styles + theme
│   │   └── package.json
│   │
│   └── backend/           # NestJS application
│       ├── src/
│       │   ├── dishes/       # Dish module
│       │   ├── matching/     # Ingredient matching module
│       │   ├── favorites/    # Favorites module
│       │   ├── history/      # History module
│       │   ├── health/       # Health check module
│       │   ├── prisma/       # Prisma service
│       │   └── common/       # Filters, interceptors
│       ├── prisma/
│       │   ├── schema.prisma # Database schema
│       │   └── seed.ts       # 20+ dishes seed data
│       └── package.json
│
└── packages/
    └── shared/            # Shared TypeScript package
        ├── src/
        │   ├── types/        # Shared types & schemas
        │   └── constants/    # Substitution matrix
        └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL 14+

### Installation

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Set up environment variables:**

Backend (`apps/backend/.env`):
```env
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1
DATABASE_URL="postgresql://user:password@localhost:5432/meal_platform?schema=public"
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:5173
```

Frontend (`apps/frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api/v1
```

3. **Set up database:**

```bash
cd apps/backend
pnpm prisma:migrate
pnpm prisma:seed
```

4. **Start development servers:**

```bash
# From root directory
pnpm dev

# Or individually:
cd apps/backend && pnpm dev    # Backend on :3001
cd apps/frontend && pnpm dev   # Frontend on :5173
```

## 📚 Core Features

### 1. Random Meal Generator

- **Weighted Randomness**: Avoids showing the same dish repeatedly
- **Anti-Repetition**: Tracks last 10 dishes
- **Smart Filtering**: Category-based generation (future enhancement)

### 2. Intelligent Ingredient Matching

**Matching Algorithm Features:**
- **Exact Match**: Direct ingredient name matching
- **Fuzzy Match**: Handles typos with Levenshtein distance
- **Substitution Match**: 20+ ingredient families (onion → shallot → leek)
- **Weighted Scoring**: Exact matches > Substitute matches
- **Coverage Calculation**: Percentage of recipe ingredients you have
- **Confidence Ranking**: Sorts results by match quality

**Substitution Groups:**
- Onion family (onion, shallot, leek, scallion)
- Proteins (chicken breast/thigh, beef cuts, pork)
- Herbs (basil, parsley, oregano)
- Dairy (milk varieties, cheese types)
- Oils, vinegars, pasta, rice, beans, and more

### 3. Favorites & History

- **Favorites**: Save recipes for quick access
- **History**: Track recently viewed dishes
- **Persistent Storage**: Client-side localStorage + server-side database
- **Optimistic Updates**: Instant UI feedback

### 4. Premium UI/UX

- **Theme System**: Light/Dark/System preference
- **Smooth Animations**: Framer Motion choreography
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders
- **Error Handling**: User-friendly error messages
- **Accessibility**: Semantic HTML, ARIA labels

## 🚢 Deployment

### Backend Deployment

**Requirements:**
- PostgreSQL database
- Node.js 18+ runtime
- Environment variables configured

**Steps:**
1. Set `DATABASE_URL` to production database
2. Run migrations: `pnpm prisma:migrate`
3. Build: `pnpm build`
4. Start: `pnpm start:prod`

**Recommended Platforms:**
- Railway.app (easiest)
- Render.com
- AWS ECS/Fargate
- Google Cloud Run
- DigitalOcean App Platform

### Frontend Deployment

**Build output:** `apps/frontend/dist`

**Recommended Platforms:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

**Environment Variables:**
- Set `VITE_API_URL` to production backend URL

## 📊 API Documentation

### Endpoints

**Dishes:**
- `GET /api/v1/dishes/random` - Get random dish
- `GET /api/v1/dishes` - List all dishes
- `GET /api/v1/dishes/:id` - Get dish by ID
- `GET /api/v1/dishes/search?q=query` - Search dishes
- `GET /api/v1/dishes/category/:category` - Filter by category

**Matching:**
- `POST /api/v1/matching` - Find matching dishes

**Favorites:**
- `GET /api/v1/favorites` - List favorites
- `POST /api/v1/favorites` - Add favorite
- `DELETE /api/v1/favorites` - Remove favorite

**History:**
- `GET /api/v1/history` - List history
- `POST /api/v1/history` - Add to history
- `DELETE /api/v1/history` - Clear history

**Health:**
- `GET /api/v1/health` - Health check

---

**Built with ❤️ using React, NestJS, and TypeScript**
