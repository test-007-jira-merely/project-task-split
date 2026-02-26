# System Architecture Documentation

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │     PWA      │          │
│  │  (Desktop)   │  │   (Tablet)   │  │  (Offline)   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
│                     ┌──────▼──────┐                              │
│                     │   React     │                              │
│                     │  Frontend   │                              │
│                     └──────┬──────┘                              │
└────────────────────────────┼─────────────────────────────────────┘
                             │ HTTPS/REST
┌────────────────────────────▼─────────────────────────────────────┐
│                        API GATEWAY LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              NestJS Application Server                   │    │
│  │                                                           │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │   Security  │  │    CORS     │  │Rate Limiter │    │    │
│  │  │   Headers   │  │  Middleware │  │  Throttler  │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  │                                                           │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │ Validation  │  │   Logging   │  │    Error    │    │    │
│  │  │    Pipes    │  │ Interceptor │  │   Filters   │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │    Dishes     │  │   Matching    │  │   Favorites   │       │
│  │    Module     │  │    Module     │  │    Module     │       │
│  │               │  │               │  │               │       │
│  │ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌───────────┐ │       │
│  │ │Controller │ │  │ │Controller │ │  │ │Controller │ │       │
│  │ └─────┬─────┘ │  │ └─────┬─────┘ │  │ └─────┬─────┘ │       │
│  │       │       │  │       │       │  │       │       │       │
│  │ ┌─────▼─────┐ │  │ ┌─────▼─────┐ │  │ ┌─────▼─────┐ │       │
│  │ │  Service  │ │  │ │  Service  │ │  │ │  Service  │ │       │
│  │ │  (Logic)  │ │  │ │(Algorithm)│ │  │ │  (CRUD)   │ │       │
│  │ └───────────┘ │  │ └───────────┘ │  │ └───────────┘ │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                   │
│  ┌───────────────┐  ┌───────────────┐                           │
│  │    History    │  │     Health    │                           │
│  │    Module     │  │    Module     │                           │
│  └───────────────┘  └───────────────┘                           │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      DATA ACCESS LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Prisma ORM Service                     │    │
│  │                                                           │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │  Connection │  │    Query    │  │  Migration  │    │    │
│  │  │     Pool    │  │   Builder   │  │   Manager   │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                       DATABASE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    PostgreSQL 14+                        │    │
│  │                                                           │    │
│  │  ┌────────┐  ┌────────────┐  ┌──────────┐  ┌────────┐ │    │
│  │  │ Dishes │  │Ingredients │  │Favorites │  │History │ │    │
│  │  └────────┘  └────────────┘  └──────────┘  └────────┘ │    │
│  │                                                           │    │
│  │  [Indexes, Constraints, Relations, Triggers]             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Presentation Layer                    │   │
│  │                                                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │  Pages   │  │Components│  │   UI     │           │   │
│  │  │  (Views) │  │(Business)│  │ (Atomic) │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └────────────────────┬──────────────────────────────────┘   │
│                       │                                       │
│  ┌────────────────────▼──────────────────────────────────┐   │
│  │              State Management Layer                   │   │
│  │                                                        │   │
│  │  ┌────────────────┐       ┌─────────────────┐       │   │
│  │  │    Zustand     │       │  React Query    │       │   │
│  │  │ (Client State) │       │ (Server State)  │       │   │
│  │  └────────────────┘       └─────────────────┘       │   │
│  │                                                        │   │
│  │  • Theme                    • API Cache               │   │
│  │  • UI State                 • Mutations               │   │
│  │  • User Prefs               • Optimistic Updates      │   │
│  │  • Local Cache              • Refetch Logic           │   │
│  └────────────────────┬──────────────────────────────────┘   │
│                       │                                       │
│  ┌────────────────────▼──────────────────────────────────┐   │
│  │                 Service Layer                         │   │
│  │                                                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ API Client  │  │   Hooks     │  │  Utilities  │  │   │
│  │  │  (Fetch)    │  │  (Custom)   │  │  (Helpers)  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Controller Layer                     │   │
│  │  (HTTP Request Handling, Validation, Response)        │   │
│  │                                                        │   │
│  │  • Route definitions                                   │   │
│  │  • DTO validation (class-validator)                   │   │
│  │  • Response formatting                                 │   │
│  └────────────────────┬──────────────────────────────────┘   │
│                       │                                       │
│  ┌────────────────────▼──────────────────────────────────┐   │
│  │                  Service Layer                        │   │
│  │  (Business Logic, Algorithms, Orchestration)          │   │
│  │                                                        │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │         Matching Algorithm Engine             │    │   │
│  │  │                                                │    │   │
│  │  │  1. Normalize ingredients                     │    │   │
│  │  │  2. Exact match                                │    │   │
│  │  │  3. Fuzzy match (Levenshtein)                 │    │   │
│  │  │  4. Substitution match                         │    │   │
│  │  │  5. Calculate scores & coverage               │    │   │
│  │  │  6. Rank results                               │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  │                                                        │   │
│  │  • Random dish selection with anti-repetition         │   │
│  │  • Favorite/history management                        │   │
│  │  • Search & filtering logic                           │   │
│  └────────────────────┬──────────────────────────────────┘   │
│                       │                                       │
│  ┌────────────────────▼──────────────────────────────────┐   │
│  │               Repository Layer                        │   │
│  │  (Data Access via Prisma ORM)                         │   │
│  │                                                        │   │
│  │  • CRUD operations                                     │   │
│  │  • Complex queries                                     │   │
│  │  • Transactions                                        │   │
│  │  • Relations                                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Random Dish Generation Flow

```
User Clicks "Generate Meal"
         │
         ▼
   HomePage Component
         │
         ▼
  useRandomDish Hook
         │
         ▼
   React Query Mutation
         │
         ▼
    API Client (GET /dishes/random)
         │
         ▼
  NestJS Controller (DishesController)
         │
         ▼
  DishesService.getRandomDish()
         │
         ├──► Check recent dishes cache
         │
         ├──► Fetch all dishes from DB
         │
         ├──► Filter out recent dishes
         │
         ├──► Select random dish
         │
         └──► Update recent dishes cache
         │
         ▼
   Prisma Service
         │
         ▼
  PostgreSQL Query
         │
         ▼
   Response → Service → Controller
         │
         ▼
    API Response (JSON)
         │
         ▼
   React Query Cache Update
         │
         ├──► Update Zustand store
         │
         ├──► Add to history
         │
         └──► Render DishCard
```

### Ingredient Matching Flow

```
User Enters Ingredients
         │
         ▼
  IngredientEngine Component
         │
         ├──► Add ingredient to Zustand store
         │
         └──► User clicks "Find Matches"
         │
         ▼
  useIngredientMatching Hook
         │
         ▼
   React Query Mutation
         │
         ▼
    API Client (POST /matching)
         │
         ▼
  NestJS Controller (MatchingController)
         │
         ▼
  MatchingService.findMatchingDishes()
         │
         ├──► Normalize user ingredients
         │
         ├──► Fetch all dishes with ingredients
         │
         └──► For each dish:
              │
              ├──► Try exact match
              ├──► Try fuzzy match (Levenshtein)
              ├──► Try substitution match
              ├──► Calculate match score
              ├──► Calculate coverage %
              └──► Track matched/missing/substituted
         │
         ▼
    Sort by match score (descending)
         │
         ▼
   Return top N results
         │
         ▼
    API Response (JSON)
         │
         ▼
   React Query Cache Update
         │
         ├──► Update Zustand matchResults
         │
         └──► Render MatchResultCard components
```

## Database Schema

```
┌──────────────────────┐       ┌──────────────────────┐
│       Dishes         │       │     Ingredients      │
├──────────────────────┤       ├──────────────────────┤
│ id (PK, UUID)        │◄──────┤ dishId (FK)          │
│ name                 │  1:N  │ id (PK, UUID)        │
│ description          │       │ name                 │
│ imageUrl             │       │ amount               │
│ category (ENUM)      │       │ unit                 │
│ difficulty (1-5)     │       │ substitutes[]        │
│ prepTime (mins)      │       └──────────────────────┘
│ cookTime (mins)      │
│ instructions (JSON)  │       ┌──────────────────────┐
│ nutrition (JSON)     │       │      Favorites       │
│ tags[]               │       ├──────────────────────┤
│ createdAt            │       │ id (PK, UUID)        │
│ updatedAt            │◄──────┤ dishId (FK)          │
└──────────────────────┘  1:N  │ userId (nullable)    │
                              │ createdAt            │
                              └──────────────────────┘

                              ┌──────────────────────┐
                              │       History        │
                              ├──────────────────────┤
                              │ id (PK, UUID)        │
         ┌────────────────────┤ dishId (FK)          │
         │                1:N │ userId (nullable)    │
         │                    │ viewedAt             │
         └────────────────────└──────────────────────┘

Indexes:
- dishes.category
- dishes.difficulty
- favorites.userId
- history.userId
- history.viewedAt
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Network Security                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • HTTPS/TLS encryption                                │   │
│  │ • CORS configuration (whitelist origins)              │   │
│  │ • Security headers (Helmet.js)                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Layer 2: Application Security                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Rate limiting (100 req/min)                         │   │
│  │ • Input validation (class-validator)                  │   │
│  │ • XSS protection (React auto-escaping)                │   │
│  │ • SQL injection prevention (Prisma ORM)               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Layer 3: Data Security                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Database credentials in environment variables       │   │
│  │ • Connection pooling & timeouts                       │   │
│  │ • Parameterized queries only                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Scalability Strategy

### Horizontal Scaling

```
Load Balancer
     │
     ├──► Backend Instance 1 ──┐
     ├──► Backend Instance 2 ──┤
     ├──► Backend Instance 3 ──┼──► PostgreSQL
     └──► Backend Instance N ──┘     (with connection pooling)
```

### Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                     Caching Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Client-Side (Browser)                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • React Query (5 min stale time)                      │   │
│  │ • Zustand persistent store (localStorage)             │   │
│  │ • Service Worker (PWA offline cache)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Server-Side (Future Enhancement)                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Redis for frequently accessed dishes                │   │
│  │ • CDN for images                                       │   │
│  │ • API response caching                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Performance Optimization

### Frontend

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Lazy loading, WebP format
- **Bundle Optimization**: Tree-shaking, minification
- **Rendering**: React memoization, virtual scrolling

### Backend

- **Query Optimization**: Database indexes
- **Connection Pooling**: Prisma default
- **Response Compression**: Gzip/Brotli
- **Efficient Algorithms**: O(n) matching complexity

## Technology Justification

### Why NestJS?

1. **Enterprise-Ready**: Built-in patterns (DI, modules)
2. **TypeScript-First**: End-to-end type safety
3. **Scalable**: Microservices-ready architecture
4. **Well-Documented**: Large community, extensive docs
5. **Testing**: Built-in testing utilities

### Why PostgreSQL + Prisma?

1. **Relational Data**: Dishes, ingredients have clear relations
2. **ACID Compliance**: Data consistency guaranteed
3. **Type Safety**: Prisma generates types from schema
4. **Migration Management**: Version-controlled schema changes
5. **Performance**: Excellent query optimization

### Why React + Vite?

1. **Fast Development**: Hot Module Replacement (HMR)
2. **Modern Build**: ESM-first, no bundler overhead
3. **Component Ecosystem**: Massive library availability
4. **Performance**: Fast builds, optimized output
5. **Developer Experience**: Best-in-class DX

---

**Last Updated**: 2026-02-26
