# API Documentation

Complete reference for the Meal Discovery Platform REST API.

## Base URL

```
Production: https://api.yourdomain.com
Development: http://localhost:3001
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible with rate limiting.

## Rate Limiting

- **Limit**: 100 requests per 60 seconds per IP
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Response Format

All API responses follow this structure:

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "ErrorType",
  "statusCode": 400,
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

## Endpoints

### Health Check

#### GET /api/health

Check system health and service status.

**Response**: 200 OK

```json
{
  "status": "healthy",
  "timestamp": "2026-02-25T10:00:00.000Z",
  "services": {
    "database": "up"
  },
  "version": "1.0.0"
}
```

**Status Values**:
- `healthy`: All services operational
- `degraded`: Some services have issues
- `unhealthy`: Critical services down

---

### Get Random Dish

#### GET /api/dishes/random

Returns a random dish with optional filters.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category: `breakfast`, `lunch`, `dinner`, `snack` |
| maxDifficulty | number | No | Maximum difficulty level (1-5) |
| excludeIds | string[] | No | Array of dish IDs to exclude |

**Example Request**:

```bash
GET /api/dishes/random?category=breakfast&maxDifficulty=3
```

**Response**: 200 OK

```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0j1",
    "name": "Classic Pancakes",
    "description": "Fluffy American-style pancakes perfect for breakfast",
    "imageUrl": "https://images.example.com/pancakes.jpg",
    "ingredients": [
      {
        "id": "ing1",
        "name": "flour",
        "quantity": "2",
        "unit": "cups",
        "substitutes": ["whole wheat flour", "almond flour"]
      },
      {
        "id": "ing2",
        "name": "eggs",
        "quantity": "2",
        "unit": "pieces",
        "substitutes": ["flax eggs"]
      }
    ],
    "instructions": [
      "Mix dry ingredients in a bowl",
      "Whisk eggs and milk in separate bowl",
      "Combine wet and dry ingredients",
      "Cook on griddle until golden"
    ],
    "category": "breakfast",
    "difficulty": 2,
    "prepTime": 10,
    "cookTime": 15,
    "nutrition": {
      "calories": 350,
      "protein": 12,
      "fat": 8,
      "carbs": 58
    },
    "tags": ["sweet", "breakfast", "american"],
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

**Error Responses**:

- `400 Bad Request`: Invalid category or difficulty value
- `404 Not Found`: No dishes match the criteria
- `429 Too Many Requests`: Rate limit exceeded

---

### Get Dish by ID

#### GET /api/dishes/:id

Get a specific dish by its ID.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Dish UUID |

**Example Request**:

```bash
GET /api/dishes/clx1a2b3c4d5e6f7g8h9i0j1
```

**Response**: 200 OK

```json
{
  "success": true,
  "data": { /* Dish object (same as random dish response) */ },
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

**Error Responses**:

- `404 Not Found`: Dish with specified ID does not exist

---

### Match Ingredients

#### POST /api/dishes/match

Find dishes that match provided ingredients.

**Request Body**:

```json
{
  "ingredients": ["chicken", "onion", "garlic"],
  "exactMatchOnly": false,
  "allowSubstitutions": true,
  "minCoverage": 60
}
```

**Body Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| ingredients | string[] | Yes | - | List of available ingredients |
| exactMatchOnly | boolean | No | false | Require exact ingredient name matches |
| allowSubstitutions | boolean | No | true | Allow ingredient substitutions |
| minCoverage | number | No | 0 | Minimum coverage percentage (0-100) |

**Example Request**:

```bash
curl -X POST http://localhost:3001/api/dishes/match \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["chicken", "onion", "garlic", "tomato"],
    "allowSubstitutions": true,
    "minCoverage": 70
  }'
```

**Response**: 200 OK

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "dishId": "clx1a2b3c4d5e6f7g8h9i0j1",
        "score": 95.5,
        "matchedIngredients": ["chicken", "onion", "garlic", "tomato"],
        "missingIngredients": ["olive oil"],
        "substitutionMatches": [
          {
            "requested": "shallot",
            "matched": "onion",
            "confidence": 0.9
          }
        ],
        "coveragePercentage": 80.0
      },
      {
        "dishId": "clx2b3c4d5e6f7g8h9i0j1k2",
        "score": 87.3,
        "matchedIngredients": ["chicken", "garlic", "tomato"],
        "missingIngredients": ["basil", "mozzarella"],
        "substitutionMatches": [],
        "coveragePercentage": 75.0
      }
    ],
    "totalResults": 2
  },
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

**Match Score Calculation**:

```
score = coveragePercentage × averageConfidence
```

Where:
- `coveragePercentage`: (matched ingredients / total required ingredients) × 100
- `averageConfidence`: Average confidence of all matches (exact = 1.0, fuzzy/substitution = 0.5-0.95)

**Error Responses**:

- `400 Bad Request`: Invalid request body (empty ingredients, invalid types)
- `429 Too Many Requests`: Rate limit exceeded

---

### Get Ingredient Suggestions

#### GET /api/ingredients/suggestions

Get autocomplete suggestions for ingredients.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (minimum 2 characters) |

**Example Request**:

```bash
GET /api/ingredients/suggestions?q=chick
```

**Response**: 200 OK

```json
{
  "success": true,
  "data": [
    "chicken",
    "chicken breast",
    "chicken thigh",
    "chickpeas"
  ],
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

**Error Responses**:

- `400 Bad Request`: Query parameter missing or too short
- `429 Too Many Requests`: Rate limit exceeded

---

### Get All Dishes

#### GET /api/dishes

Get paginated list of all dishes with optional filters.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number (1-indexed) |
| limit | number | No | 20 | Items per page (max 100) |
| category | string | No | - | Filter by category |
| difficulty | number | No | - | Filter by exact difficulty |
| maxDifficulty | number | No | - | Filter by maximum difficulty |

**Example Request**:

```bash
GET /api/dishes?page=2&limit=10&category=dinner&maxDifficulty=3
```

**Response**: 200 OK

```json
{
  "success": true,
  "data": {
    "dishes": [ /* Array of dish objects */ ],
    "total": 45,
    "page": 2,
    "limit": 10,
    "totalPages": 5
  },
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

---

### Get Metrics

#### GET /api/metrics

Get API performance metrics (for monitoring).

**Response**: 200 OK

```json
{
  "success": true,
  "data": {
    "endpoints": {
      "/api/dishes/random": {
        "endpoint": "/api/dishes/random",
        "requestCount": 1500,
        "avgResponseTime": 120.5,
        "maxResponseTime": 450,
        "minResponseTime": 45,
        "errorRate": 0.2,
        "lastAccessed": "2026-02-25T10:00:00.000Z"
      },
      "/api/dishes/match": {
        "endpoint": "/api/dishes/match",
        "requestCount": 2300,
        "avgResponseTime": 185.3,
        "maxResponseTime": 650,
        "minResponseTime": 90,
        "errorRate": 0.5,
        "lastAccessed": "2026-02-25T10:00:00.000Z"
      }
    },
    "summary": {
      "totalRequests": 5000,
      "totalErrors": 15,
      "avgResponseTime": 150.3,
      "endpointCount": 5
    }
  },
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters or request body |
| 404 | Not Found - Resource does not exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error |
| 503 | Service Unavailable - Service temporarily unavailable |

## Common Error Examples

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400,
  "details": [
    "ingredients must be an array",
    "ingredients should not be empty"
  ],
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

### Rate Limit Error (429)

```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "error": "Too Many Requests",
  "statusCode": 429,
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "message": "Dish not found",
  "error": "Not Found",
  "statusCode": 404,
  "timestamp": "2026-02-25T10:00:00.000Z"
}
```

## Data Types

### Dish

```typescript
interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  difficulty: 1 | 2 | 3 | 4 | 5;
  prepTime: number;  // minutes
  cookTime: number;  // minutes
  nutrition: Nutrition;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Ingredient

```typescript
interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  substitutes?: string[];
}
```

### Nutrition

```typescript
interface Nutrition {
  calories: number;
  protein: number;  // grams
  fat: number;      // grams
  carbs: number;    // grams
}
```

### MatchScore

```typescript
interface MatchScore {
  dishId: string;
  score: number;  // 0-100
  matchedIngredients: string[];
  missingIngredients: string[];
  substitutionMatches: SubstitutionMatch[];
  coveragePercentage: number;  // 0-100
}
```

### SubstitutionMatch

```typescript
interface SubstitutionMatch {
  requested: string;
  matched: string;
  confidence: number;  // 0-1
}
```

## Testing the API

### Using cURL

```bash
# Get random dish
curl http://localhost:3001/api/dishes/random

# Match ingredients
curl -X POST http://localhost:3001/api/dishes/match \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice"]}'

# Get suggestions
curl "http://localhost:3001/api/ingredients/suggestions?q=tom"
```

### Using HTTPie

```bash
# Get random dish
http GET :3001/api/dishes/random category==breakfast

# Match ingredients
http POST :3001/api/dishes/match \
  ingredients:='["chicken","rice"]' \
  allowSubstitutions:=true

# Get suggestions
http GET :3001/api/ingredients/suggestions q==tom
```

### Using Postman

Import this collection:

```json
{
  "info": {
    "name": "Meal Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Random Dish",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/dishes/random"
      }
    },
    {
      "name": "Match Ingredients",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/dishes/match",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"ingredients\": [\"chicken\", \"rice\"]\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    }
  ]
}
```

## Changelog

### Version 1.0.0 (2026-02-25)

- Initial API release
- Health check endpoint
- Random dish generation
- Ingredient matching with substitutions
- Ingredient autocomplete suggestions
- Performance metrics endpoint
