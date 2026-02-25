# Meal Platform Backend

NestJS backend with Clean Architecture for the Meal Discovery Platform.

## Features

- **Clean Architecture**: Separation of concerns with Domain, Application, Infrastructure, and API layers
- **Intelligent Matching**: Fuzzy matching and ingredient substitution algorithm
- **Database**: Prisma ORM with PostgreSQL
- **Validation**: Class-validator for DTO validation
- **Logging**: Structured logging with Winston
- **Security**: Helmet, CORS, rate limiting
- **Testing**: Jest with unit and integration tests

## Prerequisites

- Node.js 20+
- PostgreSQL (via Docker)
- npm 10+

## Setup

### 1. Install Dependencies

```bash
cd packages/backend
npm install
```

### 2. Start Database

From the project root:

```bash
docker-compose up -d
```

### 3. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default values should work with Docker Compose setup.

### 4. Run Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed Database

```bash
npx prisma db seed
```

This will create 100+ sample dishes with ingredients and instructions.

### 6. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

### Get Random Dish
```
GET /api/dishes/random?category=dinner&maxDifficulty=3
```

Query parameters:
- `category` (optional): breakfast, lunch, dinner, snack
- `maxDifficulty` (optional): 1-5
- `excludeIds` (optional): array of dish IDs to exclude

### Get Dish by ID
```
GET /api/dishes/:id
```

### List All Dishes
```
GET /api/dishes?page=1&limit=50&category=dinner
```

Query parameters:
- `page` (optional): page number (default: 1)
- `limit` (optional): items per page (default: 50)
- `category` (optional): filter by category

### Match Dishes by Ingredients
```
POST /api/dishes/match
Content-Type: application/json

{
  "ingredients": ["chicken", "onion", "garlic"],
  "allowSubstitutions": true,
  "minCoverage": 50
}
```

Returns dishes ranked by ingredient match score.

### Get Ingredient Suggestions
```
GET /api/ingredients/suggestions?q=tom
```

Returns autocomplete suggestions for ingredients.

## Development

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio
```

## Architecture

```
src/
├── domain/              # Business logic and entities
│   ├── entities/
│   └── services/
├── application/         # Use cases and DTOs
│   └── dto/
├── infrastructure/      # External concerns
│   ├── database/
│   ├── repositories/
│   └── logging/
└── api/                 # HTTP layer
    ├── controllers/
    ├── middleware/
    └── filters/
```

### Domain Layer
- **DishEntity**: Core business entity
- **MatchingAlgorithmService**: Ingredient matching logic
- **SubstitutionMatrixService**: Ingredient substitution rules

### Application Layer
- **DTOs**: Request/response validation objects

### Infrastructure Layer
- **PrismaService**: Database client
- **DishRepository**: Data access layer
- **LoggerService**: Structured logging

### API Layer
- **Controllers**: HTTP endpoints
- **Middleware**: Request logging
- **Filters**: Exception handling

## Matching Algorithm

The ingredient matching algorithm uses:

1. **Normalization**: Lowercase, remove special chars, handle plurals
2. **Fuzzy Matching**: Levenshtein distance (threshold: 0.8)
3. **Substitutions**: Pre-defined ingredient substitution matrix
4. **Scoring**: `(matched / total) × 100 × confidence`

### Examples

- "tomatoe" matches "tomato" (fuzzy)
- "shallot" matches "onion" (substitution, confidence: 0.9)
- "chicken breast" matches "chicken" (synonym)

## Performance

- Single dish queries: <50ms
- Match queries (100 dishes): <200ms
- Database connection pooling enabled
- Rate limiting: 100 requests per minute

## Troubleshooting

### Database Connection Failed

Ensure PostgreSQL is running:
```bash
docker-compose ps
```

### Port Already in Use

Change the port in `.env`:
```
PORT=3002
```

### Prisma Client Not Generated

Run:
```bash
npx prisma generate
```

## License

MIT
