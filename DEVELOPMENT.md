# Development Guide

Guide for setting up and working with the Meal Discovery Platform codebase.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: 20.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL**: 16.x or higher ([Download](https://www.postgresql.org/download/))
- **Git**: Latest version
- **npm**: 10.x or higher (comes with Node.js)

### Recommended Tools

- **VS Code**: With recommended extensions
  - ESLint
  - Prettier
  - Prisma
  - TypeScript Vue Plugin (Volar)
- **Docker Desktop**: For containerized database (optional)
- **Postman** or **HTTPie**: For API testing

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/meal-platform.git
cd meal-platform
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

This installs dependencies for:
- Root workspace
- `packages/shared` (shared types)
- `packages/backend` (NestJS API)
- `packages/frontend` (React + Vite)

### 3. Setup Database

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d

# Database will be available at:
# - Host: localhost
# - Port: 5432
# - Database: meal_platform
# - User: postgres
# - Password: postgres
```

#### Option B: Local PostgreSQL

```bash
# Start PostgreSQL service
# macOS (Homebrew):
brew services start postgresql@16

# Linux:
sudo systemctl start postgresql

# Create database and user
psql postgres
```

```sql
CREATE DATABASE meal_platform;
CREATE USER meal_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE meal_platform TO meal_user;
\q
```

### 4. Configure Environment Variables

#### Backend

Create `packages/backend/.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/meal_platform?schema=public"
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

#### Frontend

Create `packages/frontend/.env`:

```bash
VITE_API_URL=http://localhost:3001
```

### 5. Run Database Migrations

```bash
cd packages/backend
npx prisma migrate dev
```

### 6. Seed Database

```bash
npx prisma db seed
```

This populates the database with 100+ diverse meal recipes.

### 7. Start Development Servers

Open three terminal windows:

**Terminal 1 - Backend:**
```bash
cd packages/backend
npm run dev
# Server runs at http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd packages/frontend
npm run dev
# Server runs at http://localhost:3000
```

**Terminal 3 - Tests (optional):**
```bash
# Backend tests in watch mode
cd packages/backend
npm run test:watch

# OR Frontend tests
cd packages/frontend
npm test
```

### 8. Verify Setup

1. Open browser to http://localhost:3000
2. Click "Generate Meal" button
3. Should see a random dish displayed
4. Try adding ingredients and searching

## Development Workflow

### Running Tests

```bash
# Backend tests
cd packages/backend
npm test                 # Run once
npm run test:watch       # Watch mode
npm run test:cov         # With coverage

# Frontend tests
cd packages/frontend
npm test                 # Run once
npm test -- --watch      # Watch mode
npm test -- --coverage   # With coverage

# E2E tests
cd packages/frontend
npm run e2e
```

### Building for Production

```bash
# Build all packages
npm run build

# OR build individually
npm run build:backend
npm run build:frontend
```

### Database Operations

```bash
cd packages/backend

# Create new migration
npx prisma migrate dev --name add_new_field

# Reset database (⚠️ destructive)
npx prisma migrate reset

# Open Prisma Studio (GUI for database)
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate
```

### Code Generation

```bash
# Generate new NestJS module
cd packages/backend
nest generate module features/favorites
nest generate controller features/favorites
nest generate service features/favorites

# Generate React component (manual)
cd packages/frontend/src/components
mkdir new-feature
touch new-feature/NewFeature.tsx
touch new-feature/NewFeature.test.tsx
```

## Project Structure

```
meal-platform/
├── packages/
│   ├── shared/                 # Shared TypeScript types
│   │   └── src/
│   │       ├── types.ts        # Domain entities & DTOs
│   │       └── index.ts
│   │
│   ├── backend/                # NestJS API
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Seed data
│   │   ├── src/
│   │   │   ├── domain/         # Business logic
│   │   │   │   ├── entities/   # Domain models
│   │   │   │   └── services/   # Domain services
│   │   │   ├── application/    # Application layer
│   │   │   │   └── dto/        # Data transfer objects
│   │   │   ├── infrastructure/ # External concerns
│   │   │   │   ├── database/   # Prisma service
│   │   │   │   ├── repositories/
│   │   │   │   ├── logging/
│   │   │   │   ├── metrics/
│   │   │   │   └── cache/
│   │   │   ├── api/            # API layer
│   │   │   │   ├── controllers/
│   │   │   │   ├── middleware/
│   │   │   │   └── filters/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── test/
│   │       ├── unit/
│   │       └── integration/
│   │
│   └── frontend/               # React + Vite
│       ├── src/
│       │   ├── components/     # React components
│       │   │   ├── ui/         # Reusable UI components
│       │   │   ├── layout/     # Layout components
│       │   │   ├── dish/       # Dish-related components
│       │   │   ├── ingredient/ # Ingredient components
│       │   │   └── feedback/   # Loading, error states
│       │   ├── pages/          # Page components
│       │   ├── stores/         # Zustand state management
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utilities & API client
│       │   ├── styles/         # Global styles
│       │   └── test/           # Test utilities
│       │       ├── setup.ts
│       │       └── mocks/
│       └── e2e/                # Playwright E2E tests
│
├── scripts/                    # Utility scripts
│   └── verify.sh              # Verification script
│
├── DEPLOYMENT.md              # Deployment guide
├── TESTING.md                 # Testing guide
├── DEVELOPMENT.md             # This file
├── docker-compose.yml         # Docker configuration
└── package.json               # Root workspace config
```

## Code Style

### TypeScript

```typescript
// Use explicit types for function parameters and returns
function calculateScore(ingredients: string[]): number {
  // Implementation
}

// Use interfaces for object shapes
interface DishFilters {
  category?: DishCategory;
  maxDifficulty?: number;
}

// Use type guards for type narrowing
function isDish(obj: any): obj is Dish {
  return 'id' in obj && 'name' in obj;
}
```

### React Components

```typescript
// Use functional components with TypeScript
interface DishCardProps {
  dish: Dish;
  onFavorite?: (id: string) => void;
}

export function DishCard({ dish, onFavorite }: DishCardProps) {
  // Component implementation
}

// Use custom hooks for logic extraction
function useDishGeneration() {
  const [dish, setDish] = useState<Dish | null>(null);
  // Hook logic
  return { dish, generateDish };
}
```

### Naming Conventions

- **Files**: `kebab-case` (e.g., `dish-card.tsx`, `matching-algorithm.service.ts`)
- **Components**: `PascalCase` (e.g., `DishCard`, `IngredientEngine`)
- **Functions**: `camelCase` (e.g., `generateDish`, `findMatches`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_INGREDIENTS`, `API_BASE_URL`)
- **Interfaces**: `PascalCase` with `I` prefix for implementations (e.g., `DishRepository`, `IMatchingAlgorithm`)

### Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Git Workflow

### Branch Naming

- Feature: `feature/add-favorites`
- Bug fix: `fix/search-crash`
- Hotfix: `hotfix/critical-bug`
- Refactor: `refactor/improve-caching`

### Commit Messages

Follow Conventional Commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(backend): add favorites endpoint

Implemented GET /api/favorites endpoint with user-specific
favorite dishes retrieval.

Closes #123

---

fix(frontend): resolve infinite loop in ingredient search

The useEffect dependency array was missing the debounce function,
causing infinite re-renders.

---

test(backend): add integration tests for matching algorithm
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Push branch and create PR
4. Ensure CI passes (tests, linting)
5. Request code review
6. Address feedback
7. Merge when approved

## Troubleshooting

### Backend Won't Start

**Error**: `Port 3001 already in use`

```bash
# Find and kill process using port
lsof -ti:3001 | xargs kill -9
```

**Error**: `Database connection failed`

```bash
# Check PostgreSQL is running
docker ps  # If using Docker
# OR
pg_isready  # If using local PostgreSQL

# Verify DATABASE_URL in .env
cat packages/backend/.env
```

### Frontend Won't Start

**Error**: `Cannot find module`

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error**: `API calls fail with CORS error`

Check `CORS_ORIGIN` in backend `.env` matches frontend URL:
```bash
CORS_ORIGIN=http://localhost:3000
```

### Database Issues

**Error**: `Table does not exist`

```bash
# Run migrations
cd packages/backend
npx prisma migrate dev
```

**Error**: `No data in database`

```bash
# Reseed database
npx prisma db seed
```

### Tests Failing

**Error**: `Test timeout`

```bash
# Increase timeout in test file
it('slow test', async () => {
  // test
}, 10000);  // 10 second timeout
```

**Error**: `Database conflicts in tests`

```bash
# Use separate test database
# In test setup, set:
DATABASE_URL="postgresql://user:pass@localhost:5432/test_db"
```

### Hot Reload Not Working

**Backend**:
```bash
# Restart with --watch flag
npm run dev
```

**Frontend**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Performance Tips

### Backend

1. **Use database indexes**: Already configured in Prisma schema
2. **Implement caching**: Use `CacheService` for expensive queries
3. **Enable compression**: Already configured in `main.ts`
4. **Monitor slow queries**: Check logs for queries >100ms

### Frontend

1. **Code splitting**: Vite handles this automatically
2. **Lazy load images**: Use `loading="lazy"` attribute
3. **Debounce search**: Already implemented in ingredient search
4. **Memoize expensive computations**: Use `useMemo` hook

## Debugging

### Backend Debugging (VS Code)

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/packages/backend/src/main.ts"],
      "cwd": "${workspaceFolder}/packages/backend",
      "protocol": "inspector"
    }
  ]
}
```

### Frontend Debugging

Use React DevTools browser extension and add breakpoints in browser DevTools.

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Getting Help

- Check existing GitHub issues
- Review API documentation in `packages/backend/API.md`
- Read test files for usage examples
- Join project Discord/Slack (if available)
