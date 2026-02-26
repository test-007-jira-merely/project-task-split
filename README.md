# Meal Discovery Platform

A smart meal discovery platform that helps users find recipes based on available ingredients with intelligent matching and substitution capabilities.

## Project Structure

```
meal-discovery-platform/
├── packages/
│   └── shared/          # Shared TypeScript types
├── apps/
│   ├── backend/         # NestJS backend API
│   └── frontend/        # React frontend (to be implemented)
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
cd apps/backend
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed database
pnpm prisma:seed
```

### Development

```bash
# Start backend development server
pnpm dev:backend

# Backend will run on http://localhost:3000
# API endpoints available at http://localhost:3000/api
```

### Database Management

```bash
# Open Prisma Studio
pnpm db:studio

# Create new migration
cd apps/backend
pnpm prisma migrate dev --name your_migration_name

# Reset database
pnpm prisma migrate reset
```

## API Endpoints

### Dishes
- `GET /api/dishes/random` - Get random dish
- `GET /api/dishes/:id` - Get dish by ID
- `GET /api/dishes?category=lunch` - Get dishes by category

### Matching
- `POST /api/matching/find` - Find matching dishes by ingredients

### User Activity
- `POST /api/user-activity/favorites` - Add favorite
- `GET /api/user-activity/favorites/:userId` - Get user favorites
- `POST /api/user-activity/history` - Add history entry
- `GET /api/user-activity/history/:userId` - Get user history
- `POST /api/user-activity/recommendations` - Get recommendations

### Health
- `GET /api/health` - Health check

## Technology Stack

- **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL
- **Package Manager**: pnpm with workspaces
- **Validation**: class-validator
- **API**: RESTful

## Features

- 45+ diverse recipes across breakfast, lunch, dinner, and snacks
- Intelligent ingredient matching with fuzzy logic
- 25 ingredient substitution groups
- User favorites and history tracking
- Personalized recommendations
- Health check monitoring
