# Meal Discovery Platform

A full-stack TypeScript application for discovering meals based on available ingredients with intelligent matching algorithms.

## Architecture

This project uses a monorepo structure with npm workspaces:

- **packages/shared**: Shared TypeScript types and interfaces
- **packages/backend**: NestJS REST API with Clean Architecture
- **packages/frontend**: React + TailwindCSS SPA (to be implemented)

### Backend Architecture

The backend follows Clean Architecture principles:

- **Domain Layer**: Business entities and core logic
- **Application Layer**: Use cases and DTOs
- **Infrastructure Layer**: Database, repositories, external services
- **API Layer**: Controllers and middleware

### Tech Stack

**Backend:**
- NestJS 10
- Prisma + PostgreSQL
- Winston logging
- Class-validator
- Intelligent ingredient matching algorithm

**Frontend:**
- React 18
- TailwindCSS
- Zustand state management
- Framer Motion animations

## Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start PostgreSQL
docker-compose up -d

# Generate Prisma client
cd packages/backend
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with sample meals
npx prisma db seed

# Start backend development server
cd ../..
npm run dev:backend
```

The backend will be available at `http://localhost:3001`

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/dishes/random` - Get random dish
- `GET /api/dishes/:id` - Get dish by ID
- `GET /api/dishes` - List all dishes (paginated)
- `POST /api/dishes/match` - Match dishes by ingredients
- `GET /api/ingredients/suggestions` - Ingredient autocomplete

## Development

```bash
# Run backend in watch mode
npm run dev:backend

# Run tests
npm test

# Build for production
npm run build:backend
```

## Features

### Intelligent Ingredient Matching

- **Fuzzy Matching**: Handles typos and variations (e.g., "tomatoe" matches "tomato")
- **Substitution Support**: Suggests alternative ingredients (e.g., "shallot" for "onion")
- **Scoring Algorithm**: Ranks dishes by ingredient coverage and confidence
- **Normalization**: Handles plurals, synonyms, and variations

### Backend Features

- Clean Architecture with separation of concerns
- Comprehensive error handling and validation
- Structured logging with Winston
- Rate limiting and security headers
- Database seeded with 100+ diverse meals
- Unit and integration tests

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Database

PostgreSQL database with Prisma ORM:

- **Dish**: Main meal entity
- **Ingredient**: Ingredient with quantities
- **Instruction**: Step-by-step cooking instructions
- **SubstitutionRule**: Ingredient substitution mappings

## License

MIT
