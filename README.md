# Meal Discovery Platform - Enterprise Edition

> Production-grade meal discovery platform with intelligent ingredient matching, built for scale.

## 🏗️ Architecture Overview

This is a **monorepo** application built with **Clean Architecture** and **Domain-Driven Design** principles, designed to scale to 1M+ monthly users.

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         React + Vite Frontend (Port 5173)              │ │
│  │  • Zustand (State) • React Query (API) • Tailwind      │ │
│  │  • Framer Motion • Radix UI • PWA Support             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         NestJS API Gateway (Port 3001)                 │ │
│  │  • Controllers • DTOs • Validation • Rate Limiting     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DOMAIN LAYER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • IngredientMatcherService (Fuzzy + Substitution)     │ │
│  │  • RankingService (Weighted Scoring)                   │ │
│  │  • Domain Models (Dish, Ingredient, Match)             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL + Prisma ORM                               │ │
│  │  • 150+ Seeded Meals • Substitution Matrix             │ │
│  │  • Synonym Mappings • Full-text Search Ready           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Technology Stack Decisions

### Frontend: React + Vite + TypeScript
**Rationale:**
- ⚡ Vite: Lightning-fast HMR, optimized builds
- 📱 React 18: Concurrent features, SSR-ready
- 🎯 TypeScript: Type safety, better DX
- 🎨 Tailwind CSS: Utility-first, minimal bundle
- 🌊 Framer Motion: Performant animations
- 🔄 TanStack Query: Smart caching, auto-refetch
- 🐻 Zustand: Lightweight state (< 1KB)

### Backend: NestJS + PostgreSQL + Prisma
**Rationale:**
- 🏛️ NestJS: Enterprise-grade, DI, modularity
- 🐘 PostgreSQL: ACID compliance, JSON support, full-text search
- 🔷 Prisma: Type-safe ORM, migrations, introspection
- ⚖️ Clean Architecture: Testable, maintainable, scalable
- 📈 Horizontal Scaling: Stateless design, DB connection pooling

### Image Strategy: Hybrid (Unsplash API + CDN Caching)
**Rationale:**
- 📸 Unsplash: High-quality food photography
- 🚀 CDN: Edge caching, < 100ms latency
- 💾 Fallback: Curated base dataset
- 💰 Cost-effective: Free tier + progressive enhancement

## 🎯 Core Features

### 1. Random Dish Generator
- Weighted randomness (difficulty-based)
- Anti-repetition tracking (last 10 dishes)
- Category filtering
- Advanced motion choreography

### 2. Intelligent Ingredient Matching
**Matching Algorithm:**
```
Score Calculation:
- Exact Match: 10 points (confidence: 1.0)
- Partial Match: 5 points × similarity (confidence: 0.75-1.0)
- Substitution Match: 3 points (confidence: 0.8)

Coverage Multiplier: 1 + (coverage% / 100)
Final Score = Base Score × Coverage × Category Weight
```

**Features:**
- Fuzzy matching (Levenshtein distance)
- Synonym resolution (50+ mappings)
- Substitution matrix (50+ ingredients)
- Weighted ranking
- Missing ingredient tracking

### 3. Favorites & History
- Local state + API persistence
- Smart recommendations
- Preference-based scoring

### 4. Dark/Light Themes
- CSS variables
- OS preference detection
- Smooth transitions
- Full accessibility

## 📁 Project Structure

```
meal-discovery-platform/
├── apps/
│   ├── frontend/                 # React + Vite application
│   │   ├── src/
│   │   │   ├── components/       # Reusable UI components
│   │   │   │   ├── dish/         # DishCard, etc.
│   │   │   │   ├── ingredient/   # IngredientInput, etc.
│   │   │   │   ├── layout/       # AppLayout, Navbar
│   │   │   │   └── ui/           # ThemeToggle, LoadingSkeleton
│   │   │   ├── lib/              # API client, utilities
│   │   │   ├── pages/            # Route pages
│   │   │   ├── stores/           # Zustand stores
│   │   │   └── main.tsx          # Entry point
│   │   ├── public/               # Static assets
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── backend/                  # NestJS application
│       ├── src/
│       │   ├── domain/           # Domain logic (DDD)
│       │   │   └── services/     # IngredientMatcher, Ranking
│       │   ├── infrastructure/   # Prisma, external services
│       │   ├── modules/          # Feature modules
│       │   │   ├── dishes/       # Dish CRUD
│       │   │   ├── matching/     # Ingredient matching
│       │   │   ├── favorites/    # User favorites
│       │   │   ├── history/      # View history
│       │   │   └── health/       # Health checks
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── prisma/
│       │   ├── schema.prisma     # Database schema
│       │   └── seed.ts           # 150+ dishes, substitutions
│       └── package.json
│
├── packages/
│   └── shared-types/             # Shared TypeScript types
│       ├── src/
│       │   ├── dish.types.ts
│       │   ├── ingredient.types.ts
│       │   ├── matching.types.ts
│       │   ├── user.types.ts
│       │   └── api.types.ts
│       └── package.json
│
├── package.json                  # Root workspace config
├── tsconfig.json                 # Shared TS config
├── .eslintrc.json
├── .prettierrc.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd meal-discovery-platform
pnpm install
```

2. **Setup PostgreSQL database:**
```bash
# Create database
createdb meal_discovery

# Or using psql
psql -U postgres
CREATE DATABASE meal_discovery;
```

3. **Configure environment variables:**

**Backend (.env):**
```bash
cd apps/backend
cp .env.example .env

# Edit .env with your configuration
DATABASE_URL="postgresql://user:password@localhost:5432/meal_discovery"
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```bash
cd apps/frontend
cp .env.example .env

# Edit .env
VITE_API_URL=http://localhost:3001/api/v1
```

4. **Generate Prisma client and seed database:**
```bash
cd apps/backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

5. **Build shared types:**
```bash
cd packages/shared-types
pnpm build
```

6. **Start development servers:**

**Terminal 1 - Backend:**
```bash
cd apps/backend
pnpm dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm dev
```

7. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/v1
- API Docs: http://localhost:3001/api/docs

## 🧪 Testing

### Backend Tests
```bash
cd apps/backend
pnpm test              # Unit tests
pnpm test:watch        # Watch mode
pnpm test:cov          # Coverage report
pnpm test:e2e          # E2E tests
```

### Frontend Tests
```bash
cd apps/frontend
pnpm test              # Vitest
pnpm test:ui           # Vitest UI
```

## 📦 Production Build

### Build all packages
```bash
pnpm build
```

### Backend production
```bash
cd apps/backend
pnpm build
NODE_ENV=production pnpm start
```

### Frontend production
```bash
cd apps/frontend
pnpm build
pnpm preview
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Create docker-compose.yml (see deployment guide below)
docker-compose up -d
```

### Manual Docker Build

**Backend:**
```dockerfile
# apps/backend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3001
CMD ["node", "dist/main"]
```

**Frontend:**
```dockerfile
# apps/frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🌍 Environment Variables

### Backend
```env
# Server
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/meal_discovery

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=info
```

### Frontend
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_APP_NAME=Meal Discovery Platform
```

## 📊 Database Schema

See `apps/backend/prisma/schema.prisma` for complete schema.

**Key Models:**
- `Dish`: Core meal entity
- `DishIngredient`: Ingredient list
- `DishInstruction`: Cooking steps
- `DishNutrition`: Nutritional info
- `IngredientSubstitution`: Substitution matrix
- `IngredientSynonym`: Synonym mappings
- `UserFavorite`: User favorites
- `DishHistory`: View history

## 🔒 Security Features

- ✅ Helmet.js (Security headers)
- ✅ Rate limiting (Throttler)
- ✅ Input validation (class-validator)
- ✅ CORS configuration
- ✅ Environment-based configs
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection

## 📈 Performance Optimizations

- ⚡ Code splitting (Vite)
- 🖼️ Image lazy loading
- 💾 React Query caching (5 min stale time)
- 🔄 Virtualized lists (for large datasets)
- 🌐 CDN-ready asset delivery
- 📦 Tree-shaking
- 🗜️ Compression middleware

## 🎨 UI/UX Features

- 🌗 Dark/light themes
- 📱 Fully responsive
- ♿ Accessibility (ARIA labels, keyboard nav)
- 🎭 Framer Motion animations
- ⚡ Skeleton loading states
- 🔔 Toast notifications (Radix UI)
- 🎯 Focus management

## 📚 API Documentation

Swagger docs available at: http://localhost:3001/api/docs

**Key Endpoints:**
- `POST /api/v1/dishes/random` - Generate random dish
- `GET /api/v1/dishes` - List all dishes
- `POST /api/v1/matching` - Match ingredients
- `GET /api/v1/favorites` - Get user favorites
- `POST /api/v1/favorites/:dishId` - Add favorite
- `GET /api/v1/history` - Get view history
- `GET /api/v1/health` - Health check

## 🛠️ Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Prisma Studio**: Database GUI
- **React DevTools**: Component inspection
- **TanStack Query DevTools**: API state debugging

## 📖 Additional Documentation

- Architecture Decisions: `docs/architecture.md`
- API Reference: `docs/api.md`
- Deployment Guide: `docs/deployment.md`
- Contributing: `docs/contributing.md`

## 🤝 Contributing

This is an enterprise project following strict coding standards:
1. Follow Clean Architecture principles
2. Write tests for new features
3. Update documentation
4. Follow commit conventions
5. Run linters before committing

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Unsplash for food photography
- NestJS, React, and Prisma teams
- Open source community

---

**Built with ❤️ for food lovers everywhere**
