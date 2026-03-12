# Quick Start Guide

## Prerequisites
- Node.js 20+
- Docker Desktop
- npm 10+

## Installation (5 minutes)

```bash
# 1. Clone and install
npm install

# 2. Start database
docker-compose up -d

# 3. Setup backend
cd packages/backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 4. Start server
cd ../..
npm run dev:backend
```

Backend runs at: **http://localhost:3001**

## Test It Works

```bash
# Health check
curl http://localhost:3001/api/health

# Get a random dish
curl http://localhost:3001/api/dishes/random

# Match dishes with ingredients
curl -X POST http://localhost:3001/api/dishes/match \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "onion"]}'
```

## Common Commands

```bash
# Backend development
npm run dev:backend           # Start with hot reload
npm test                      # Run tests
npx prisma studio             # Open database GUI

# Database
docker-compose up -d          # Start PostgreSQL
docker-compose down           # Stop PostgreSQL
npx prisma db seed            # Reseed database
npx prisma migrate reset      # Reset database
```

## Project Structure

```
├── packages/
│   ├── shared/              # Shared TypeScript types
│   └── backend/             # NestJS API
│       ├── src/
│       │   ├── domain/          # Business logic
│       │   ├── application/     # DTOs
│       │   ├── infrastructure/  # Database, logging
│       │   └── api/             # Controllers
│       └── prisma/
│           ├── schema.prisma    # Database schema
│           └── seed.ts          # 122+ sample dishes
└── docker-compose.yml       # PostgreSQL
```

## API Endpoints

```
GET    /api/health                     # System health
GET    /api/dishes/random              # Random dish
GET    /api/dishes/:id                 # Dish by ID
GET    /api/dishes                     # List all dishes
POST   /api/dishes/match               # Match by ingredients
GET    /api/ingredients/suggestions    # Autocomplete
```

## Features

✅ **Intelligent Matching**
- Fuzzy: "tomatoe" → "tomato"
- Substitution: "shallot" → "onion"
- Scoring with coverage %

✅ **Clean Architecture**
- Domain, Application, Infrastructure, API layers
- Dependency injection
- Type-safe throughout

✅ **Production Ready**
- Security headers
- Rate limiting
- Structured logging
- Error handling

## Troubleshooting

**Database won't connect?**
```bash
docker-compose ps              # Check if running
docker-compose restart         # Restart if needed
```

**Port 3001 in use?**
Edit `packages/backend/.env`:
```
PORT=3002
```

**Prisma errors?**
```bash
cd packages/backend
npx prisma generate           # Regenerate client
```

## Documentation

- `README.md` - Project overview
- `SETUP.md` - Detailed setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `packages/backend/README.md` - Backend-specific docs

## Support

Check the full documentation in the README files for:
- Architecture details
- API documentation
- Testing guide
- Performance benchmarks
- Deployment instructions

---

**Ready to code!** The backend is fully functional with 122+ sample dishes. 🚀
