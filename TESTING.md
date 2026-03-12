# Testing Guide

Comprehensive guide for running and writing tests for the Meal Discovery Platform.

## Table of Contents

- [Overview](#overview)
- [Backend Testing](#backend-testing)
- [Frontend Testing](#frontend-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)

## Overview

The project uses a comprehensive testing strategy:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test API endpoints and service interactions
- **E2E Tests**: Test complete user workflows across the application

### Testing Stack

**Backend:**
- Jest: Test runner and assertion library
- ts-jest: TypeScript support for Jest
- Supertest: HTTP integration testing
- @nestjs/testing: NestJS testing utilities

**Frontend:**
- Vitest: Fast test runner (Vite-native)
- Testing Library: Component testing utilities
- MSW (Mock Service Worker): API mocking
- Playwright: E2E browser testing

## Backend Testing

### Running Backend Tests

```bash
# Run all tests
cd packages/backend
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm test -- matching-algorithm.service.spec.ts

# Run tests matching pattern
npm test -- --testNamePattern="fuzzyMatch"
```

### Test Structure

```
packages/backend/
├── src/
│   ├── domain/services/__tests__/
│   │   ├── matching-algorithm.service.spec.ts
│   │   └── substitution-matrix.service.spec.ts
│   └── infrastructure/repositories/__tests__/
│       └── dish.repository.spec.ts
└── test/
    └── integration/
        └── dishes.integration.spec.ts
```

### Unit Tests

**Location**: Co-located with source files in `__tests__` directories

**Example**: Testing the matching algorithm

```typescript
describe('MatchingAlgorithmService', () => {
  let service: MatchingAlgorithmService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MatchingAlgorithmService, SubstitutionMatrixService],
    }).compile();

    service = module.get<MatchingAlgorithmService>(MatchingAlgorithmService);
  });

  it('should return 1.0 for exact match', () => {
    const score = service.fuzzyMatch('onion', 'onion');
    expect(score).toBe(1.0);
  });
});
```

### Integration Tests

**Location**: `test/integration/` directory

**Example**: Testing API endpoints

```typescript
describe('Dishes API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/dishes/random should return a dish', () => {
    return request(app.getHttpServer())
      .get('/api/dishes/random')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('name');
      });
  });
});
```

### Coverage Goals

**Target Coverage**: 80% for all metrics

```
Statements   : 80%
Branches     : 80%
Functions    : 80%
Lines        : 80%
```

**View Coverage Report**:

```bash
npm run test:cov
# Open coverage/lcov-report/index.html in browser
```

## Frontend Testing

### Running Frontend Tests

```bash
# Run all tests
cd packages/frontend
npm test

# Run tests in UI mode
npm run test:ui

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- DishCard.test.tsx

# Run tests in watch mode
npm test -- --watch
```

### Test Structure

```
packages/frontend/
├── src/
│   ├── components/dish/__tests__/
│   │   └── DishCard.test.tsx
│   ├── stores/__tests__/
│   │   └── dish-store.test.ts
│   └── test/
│       ├── setup.ts
│       ├── mocks/
│       │   ├── server.ts
│       │   └── handlers.ts
│       └── integration/
│           └── dish-generation.test.tsx
```

### Component Tests

**Example**: Testing DishCard component

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { DishCard } from '../DishCard';

describe('DishCard', () => {
  const mockDish = {
    id: '1',
    name: 'Chicken Parmesan',
    description: 'Delicious Italian dish',
    // ... other properties
  };

  it('should render dish information', () => {
    render(<DishCard dish={mockDish} />);

    expect(screen.getByText('Chicken Parmesan')).toBeInTheDocument();
    expect(screen.getByText('Delicious Italian dish')).toBeInTheDocument();
  });

  it('should call onFavoriteToggle when favorite button clicked', () => {
    const mockFavorite = jest.fn();
    render(<DishCard dish={mockDish} onFavoriteToggle={mockFavorite} />);

    const favoriteBtn = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(favoriteBtn);

    expect(mockFavorite).toHaveBeenCalledWith('1');
  });
});
```

### Store Tests

**Example**: Testing Zustand store

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDishStore } from '../dish-store';

describe('DishStore', () => {
  it('should add dish to favorites', () => {
    const { result } = renderHook(() => useDishStore());

    act(() => {
      result.current.toggleFavorite('dish-1');
    });

    expect(result.current.isFavorite('dish-1')).toBe(true);
  });
});
```

### Integration Tests with MSW

**Setup Mock Server** (`src/test/mocks/server.ts`):

```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const handlers = [
  rest.get('*/api/dishes/random', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: '1',
          name: 'Test Dish',
          // ... mock data
        },
      })
    );
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Integration Test**:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomePage } from '@/pages/HomePage';

describe('Dish Generation Flow', () => {
  it('should generate and display dish', async () => {
    render(<HomePage />);

    const generateBtn = screen.getByRole('button', { name: /generate/i });
    await userEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText('Test Dish')).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

### Setup Playwright

```bash
cd packages/frontend
npm install -D @playwright/test
npx playwright install
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run e2e

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium

# Run specific test file
npx playwright test dish-generation.spec.ts

# Run in UI mode for debugging
npx playwright test --ui

# Generate test report
npx playwright show-report
```

### E2E Test Structure

```
packages/frontend/
└── e2e/
    ├── dish-generation.spec.ts
    ├── ingredient-matching.spec.ts
    └── accessibility.spec.ts
```

### Writing E2E Tests

**Example**: Testing dish generation flow

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dish Generation', () => {
  test('should generate and display random dish', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Generate Meal")');

    await expect(page.locator('[data-testid="dish-card"]')).toBeVisible();
    await expect(page.locator('h2')).toContainText(/.+/);
  });

  test('should persist favorites after reload', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Generate Meal")');
    await page.click('[data-testid="favorite-button"]');

    await page.reload();
    await page.goto('/favorites');

    await expect(page.locator('[data-testid="dish-card"]')).toHaveCount(1);
  });
});
```

### Testing Across Browsers

Playwright configuration supports multiple browsers:

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

## Test Coverage

### Viewing Coverage Reports

**Backend**:
```bash
cd packages/backend
npm run test:cov
open coverage/lcov-report/index.html
```

**Frontend**:
```bash
cd packages/frontend
npm test -- --coverage
open coverage/index.html
```

### Coverage Thresholds

Both backend and frontend enforce 80% coverage:

```javascript
// jest.config.js (backend)
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

### Improving Coverage

1. **Identify uncovered code**:
   ```bash
   npm run test:cov
   # Check red/yellow highlighted lines in HTML report
   ```

2. **Add tests for critical paths**:
   - Business logic (matching algorithm, scoring)
   - API endpoints
   - User interactions
   - Error handling

3. **Exclude non-testable code**:
   ```javascript
   collectCoverageFrom: [
     'src/**/*.ts',
     '!src/**/*.interface.ts',  // Type definitions
     '!src/**/*.dto.ts',         // Data transfer objects
     '!src/main.ts',             // Bootstrap file
   ],
   ```

## Writing Tests

### Best Practices

#### 1. Test Structure (AAA Pattern)

```typescript
it('should do something', () => {
  // Arrange: Setup test data
  const input = 'test';

  // Act: Execute the code
  const result = myFunction(input);

  // Assert: Verify the result
  expect(result).toBe('expected');
});
```

#### 2. Descriptive Test Names

✅ **Good**:
```typescript
it('should return 100% coverage when all ingredients match', () => {});
it('should throw error when ingredients array is empty', () => {});
```

❌ **Bad**:
```typescript
it('test 1', () => {});
it('works', () => {});
```

#### 3. Test One Thing

```typescript
// Good: Tests one specific behavior
it('should convert ingredient to lowercase', () => {
  expect(normalize('ONION')).toBe('onion');
});

// Bad: Tests multiple behaviors
it('should normalize ingredients', () => {
  expect(normalize('ONION')).toBe('onion');
  expect(normalize('tomatoes')).toBe('tomato');
  expect(fuzzyMatch('cat', 'dog')).toBe(0.3);
});
```

#### 4. Use Test Fixtures

```typescript
// Create reusable test data
const createMockDish = (overrides = {}) => ({
  id: 'test-id',
  name: 'Test Dish',
  ingredients: [],
  ...overrides,
});

// Use in tests
it('should process dish', () => {
  const dish = createMockDish({ name: 'Custom Dish' });
  // ... test logic
});
```

#### 5. Mock External Dependencies

```typescript
// Mock API calls
jest.mock('../../api/client', () => ({
  fetchDish: jest.fn().mockResolvedValue(mockDish),
}));

// Mock database
const mockPrisma = {
  dish: {
    findMany: jest.fn().mockResolvedValue([mockDish]),
  },
};
```

### Common Testing Patterns

#### Testing Async Code

```typescript
it('should fetch dish from API', async () => {
  const dish = await fetchDish('dish-id');
  expect(dish).toHaveProperty('name');
});
```

#### Testing Error Handling

```typescript
it('should throw error for invalid input', () => {
  expect(() => {
    processIngredients([]);
  }).toThrow('Ingredients cannot be empty');
});

it('should handle API errors', async () => {
  mockApi.mockRejectedValue(new Error('Network error'));

  await expect(fetchDish('id')).rejects.toThrow('Network error');
});
```

#### Testing User Interactions

```typescript
it('should toggle favorite on click', async () => {
  render(<DishCard dish={mockDish} />);

  const button = screen.getByRole('button', { name: /favorite/i });
  await userEvent.click(button);

  expect(button).toHaveAttribute('aria-pressed', 'true');
});
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run backend tests
        run: npm run test:backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run frontend tests
        run: npm run test:frontend

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: packages/frontend/playwright-report/
```

## Troubleshooting

### Backend Tests Failing

**Issue**: Database connection errors

**Solution**:
```bash
# Ensure PostgreSQL is running
docker-compose up -d postgres

# Check DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/test"
```

### Frontend Tests Failing

**Issue**: "Cannot find module" errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Tests timing out

**Solution**:
```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // test logic
}, 10000); // 10 second timeout
```

### E2E Tests Failing

**Issue**: Elements not found

**Solution**:
```typescript
// Add explicit waits
await page.waitForSelector('[data-testid="dish-card"]');

// Or use auto-waiting assertions
await expect(page.locator('[data-testid="dish-card"]')).toBeVisible();
```

**Issue**: Tests flaky

**Solution**:
```typescript
// Use retry assertions
await expect(async () => {
  const text = await page.textContent('h1');
  expect(text).toBe('Expected Title');
}).toPass();
```

## Further Reading

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
