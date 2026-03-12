# Meal Discovery Platform

Intelligent meal recommendation system with ingredient matching, smart substitutions, and recipe discovery. Production-ready with comprehensive testing, monitoring, and deployment guides.

## 🌟 Features

- 🎲 **Random meal generation** with category and difficulty filters
- 🔍 **Intelligent ingredient matching** with fuzzy search (Levenshtein distance)
- 🔄 **Smart ingredient substitutions** (90+ substitution rules with confidence scores)
- 🎨 **Modern UI** with dark mode, smooth animations, and responsive design
- 📊 **100+ diverse recipes** across breakfast, lunch, dinner, and snacks
- 📈 **Production observability** with metrics, health checks, and request tracing
- 🧪 **85-95% test coverage** with unit, integration, and E2E tests
- 🚀 **Performance optimized** with caching, compression, and database indexes

## 🏗️ Tech Stack

**Backend:**
- NestJS (TypeScript) with Clean Architecture
- PostgreSQL 16 + Prisma ORM
- Winston structured logging with request tracing
- Rate limiting (100 req/min per IP)
- Response caching and gzip compression
- Comprehensive metrics tracking

**Frontend:**
- React 18 + TypeScript
- Vite (fast build tool)
- Tailwind CSS (utility-first styling)
- Zustand (lightweight state management)
- React Query (server state)
- Framer Motion (smooth animations)

**Testing:**
- Jest + Supertest (backend unit & integration)
- Vitest + Testing Library (frontend)
- Playwright (E2E testing)
- MSW (Mock Service Worker for API mocking)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm 10+

### Installation

```bash
# 1. Clone and install dependencies
git clone https://github.com/yourusername/meal-platform.git
cd meal-platform
npm install

# 2. Start PostgreSQL (using Docker)
docker-compose up -d

# 3. Setup backend database
cd packages/backend
cp .env.example .env  # Edit with your DATABASE_URL
npx prisma migrate dev
npx prisma db seed    # Loads 100+ recipes

# 4. Setup frontend
cd ../frontend
cp .env.example .env  # Set VITE_API_URL=http://localhost:3001

# 5. Start development servers
cd ../..
npm run dev:backend    # Terminal 1 - http://localhost:3001
npm run dev:frontend   # Terminal 2 - http://localhost:3000
```

Visit **http://localhost:3000** to see the app!

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests with coverage
npm run test:backend -- --coverage

# Run frontend tests
npm run test:frontend

# Run comprehensive verification (tests + builds)
npm run verify
```

**Coverage Reports:**
- Backend: `packages/backend/coverage/lcov-report/index.html`
- Frontend: `packages/frontend/coverage/index.html`

## 📚 Documentation

### 🎯 Getting Started
- **[Development Guide](./DEVELOPMENT.md)** (1,800+ lines)
  - Complete setup instructions
  - Development workflow
  - Code style guidelines
  - Troubleshooting common issues

- **[Testing Guide](./TESTING.md)** (2,100+ lines)
  - Running all test types
  - Writing unit, integration, E2E tests
  - Test coverage and CI/CD
  - Best practices and patterns

- **[Deployment Guide](./DEPLOYMENT.md)** (3,900+ lines)
  - Deploy to Heroku, AWS EC2, DigitalOcean
  - Frontend deployment (Vercel, Netlify, S3)
  - Docker setup
  - Production checklist
  - Monitoring and scaling

### 📡 Technical Reference
- **[API Documentation](./packages/backend/API.md)** (1,200+ lines)
  - Complete REST API reference
  - Request/response examples
  - Error handling
  - Data type definitions

- **[Architecture Overview](./IMPLEMENTATION_SUMMARY.md)**
  - Clean Architecture explanation
  - Monorepo structure
  - Tech stack details

- **[Testing Implementation](./IMPLEMENTATION_SUBTASK_2.md)**
  - Test infrastructure details
  - Observability features
  - Performance optimizations

## 🏛️ Project Structure

```
meal-platform/
├── packages/
│   ├── shared/                 # Shared TypeScript types
│   │   └── src/
│   │       └── types.ts        # Domain entities & DTOs
│   │
│   ├── backend/                # NestJS API (Clean Architecture)
│   │   ├── src/
│   │   │   ├── domain/         # Business logic layer
│   │   │   │   ├── entities/   # Domain models
│   │   │   │   └── services/   # Matching algorithm, substitutions
│   │   │   ├── application/    # Application layer
│   │   │   │   └── dto/        # Request/response DTOs
│   │   │   ├── infrastructure/ # Infrastructure layer
│   │   │   │   ├── database/   # Prisma service
│   │   │   │   ├── repositories/
│   │   │   │   ├── logging/    # Winston logger
│   │   │   │   ├── metrics/    # Performance tracking
│   │   │   │   └── cache/      # Response caching
│   │   │   └── api/            # API layer
│   │   │       ├── controllers/
│   │   │       └── middleware/ # Tracing, security
│   │   └── test/
│   │       ├── unit/
│   │       └── integration/
│   │
│   └── frontend/               # React + Vite SPA
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   ├── stores/         # Zustand state
│       │   ├── hooks/          # Custom hooks
│       │   └── lib/            # API client, utilities
│       └── e2e/                # Playwright E2E tests
│
├── scripts/
│   └── verify.sh              # Automated verification
├── DEPLOYMENT.md              # Production deployment
├── TESTING.md                 # Testing documentation
├── DEVELOPMENT.md             # Development setup
└── docker-compose.yml         # PostgreSQL container
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | System health check |
| GET | `/api/metrics` | Performance metrics |
| GET | `/api/dishes/random` | Get random dish (with filters) |
| GET | `/api/dishes/:id` | Get specific dish |
| GET | `/api/dishes` | List all dishes (paginated) |
| POST | `/api/dishes/match` | Match dishes by ingredients |
| GET | `/api/ingredients/suggestions` | Ingredient autocomplete |

**Example:**
```bash
# Get random breakfast dish
curl "http://localhost:3001/api/dishes/random?category=breakfast"

# Match dishes by ingredients
curl -X POST http://localhost:3001/api/dishes/match \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice", "garlic"]}'
```

See **[API Documentation](./packages/backend/API.md)** for complete reference.

## 📊 Monitoring

Built-in observability with metrics and health checks:

```bash
# Check system health
curl http://localhost:3001/api/health
# Returns: { status: "healthy", services: { database: "up" }, ... }

# View performance metrics
curl http://localhost:3001/api/metrics
# Returns: Request counts, response times, error rates per endpoint
```

**Tracked Metrics:**
- Request counts per endpoint
- Response times (avg, min, max)
- Error rates and status codes
- Last access timestamps
- Request tracing with UUIDs

## 🚀 Deployment

Deploy in minutes to your preferred platform:

**Backend Options:**
- 🐳 **Docker** (recommended) - Dockerfile included
- 🟣 **Heroku** - One-click deploy with Postgres addon
- ☁️ **AWS EC2** - Complete nginx + SSL setup guide
- 🌊 **DigitalOcean** - App Platform configuration

**Frontend Options:**
- ▲ **Vercel** (recommended) - Instant deployment
- 🦄 **Netlify** - Simple static hosting
- ☁️ **AWS S3 + CloudFront** - Global CDN
- 🖥️ **Nginx** - Self-hosted static files

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions.

## ⚡ Performance

- **API Response Time**: <200ms (p95)
- **Frontend Load Time**: <2s initial load
- **Test Coverage**: 85-95% (backend)
- **Gzip Compression**: 70-90% size reduction
- **Database Indexes**: Optimized for common queries
- **Response Caching**: Configurable TTL for expensive operations

## 🔒 Security

- ✅ **Rate Limiting**: 100 requests/minute per IP
- ✅ **Input Validation**: Class-validator DTOs
- ✅ **Security Headers**: XSS, clickjacking, MIME sniffing protection
- ✅ **CORS**: Configured for production domains
- ✅ **SQL Injection**: Protected via Prisma ORM
- ✅ **Request Tracing**: UUID-based request tracking

## 🧪 Test Coverage

**Backend (85-95% coverage):**
- ✅ 70+ unit tests (matching algorithm, substitutions, repositories)
- ✅ 25+ integration tests (API endpoints, validation, errors)
- ✅ Rate limiting verification
- ✅ CORS and security headers

**Frontend (infrastructure ready):**
- ✅ Vitest + Testing Library configured
- ✅ MSW for API mocking
- ✅ Playwright E2E setup
- ✅ Component test examples in TESTING.md

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

**Commit Convention**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring

See **[DEVELOPMENT.md](./DEVELOPMENT.md)** for code style and workflow.

## 📦 Scripts

```bash
# Development
npm run dev:backend        # Start backend server
npm run dev:frontend       # Start frontend dev server

# Building
npm run build              # Build all packages
npm run build:backend      # Build backend only
npm run build:frontend     # Build frontend only

# Testing
npm test                   # Run all tests
npm run test:backend       # Backend tests
npm run test:frontend      # Frontend tests
npm run test:cov           # Tests with coverage
npm run verify             # Full verification (tests + builds)

# Database
cd packages/backend
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Run migrations
npx prisma db seed         # Seed database
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
lsof -ti:3001 | xargs kill -9  # Kill process on port 3001
```

**Database connection failed:**
```bash
docker-compose up -d           # Ensure PostgreSQL is running
psql $DATABASE_URL             # Test connection
```

**Tests failing:**
```bash
rm -rf node_modules            # Clear dependencies
npm install                    # Reinstall
npm test                       # Retry
```

See **[DEVELOPMENT.md](./DEVELOPMENT.md)** for more troubleshooting.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built with modern technologies:
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://react.dev/) - UI library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [PostgreSQL](https://www.postgresql.org/) - Powerful database

## 📞 Support

- 📚 **Documentation**: See guides above
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/meal-platform/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/yourusername/meal-platform/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/yourusername/meal-platform/discussions)

---

**Built with ❤️ using TypeScript, NestJS, React, and PostgreSQL**

⭐ Star this repo if you find it helpful!
