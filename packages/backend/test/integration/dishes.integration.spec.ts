import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Dishes API Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/health', () => {
    it('should return healthy status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(['healthy', 'degraded', 'unhealthy']).toContain(res.body.status);
          expect(res.body).toHaveProperty('services');
          expect(res.body.services).toHaveProperty('database');
        });
    });

    it('should include version and timestamp', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('version');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('GET /api/dishes/random', () => {
    it('should return a random dish', () => {
      return request(app.getHttpServer())
        .get('/api/dishes/random')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');

          const dish = res.body.data;
          expect(dish).toHaveProperty('id');
          expect(dish).toHaveProperty('name');
          expect(dish).toHaveProperty('description');
          expect(dish).toHaveProperty('imageUrl');
          expect(dish).toHaveProperty('ingredients');
          expect(dish).toHaveProperty('instructions');
          expect(dish).toHaveProperty('category');
          expect(dish).toHaveProperty('difficulty');
          expect(dish).toHaveProperty('prepTime');
          expect(dish).toHaveProperty('cookTime');
          expect(dish).toHaveProperty('nutrition');

          expect(Array.isArray(dish.ingredients)).toBe(true);
          expect(Array.isArray(dish.instructions)).toBe(true);
        });
    });

    it('should respect category filter', () => {
      return request(app.getHttpServer())
        .get('/api/dishes/random?category=breakfast')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.category).toBe('breakfast');
        });
    });

    it('should respect maxDifficulty filter', () => {
      return request(app.getHttpServer())
        .get('/api/dishes/random?maxDifficulty=2')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.difficulty).toBeLessThanOrEqual(2);
        });
    });

    it('should exclude specified IDs', async () => {
      // First get a random dish
      const firstResponse = await request(app.getHttpServer())
        .get('/api/dishes/random')
        .expect(200);

      const excludeId = firstResponse.body.data.id;

      // Request another excluding the first one
      const secondResponse = await request(app.getHttpServer())
        .get(`/api/dishes/random?excludeIds=${excludeId}`)
        .expect(200);

      // Should be different (though there's a tiny chance they're the same if only 2 dishes exist)
      if (secondResponse.body.data) {
        expect(secondResponse.body.data.id).not.toBe(excludeId);
      }
    });

    it('should return different dishes on repeated calls', async () => {
      const ids = new Set<string>();

      // Make multiple requests
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .get('/api/dishes/random')
          .expect(200);

        ids.add(response.body.data.id);
      }

      // Should have gotten at least 2 different dishes
      expect(ids.size).toBeGreaterThanOrEqual(2);
    });

    it('should validate category parameter', () => {
      return request(app.getHttpServer())
        .get('/api/dishes/random?category=invalid-category')
        .expect(400);
    });
  });

  describe('POST /api/dishes/match', () => {
    it('should return matched dishes', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: ['chicken', 'onion', 'garlic'],
          allowSubstitutions: true,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('matches');
          expect(res.body.data).toHaveProperty('totalResults');
          expect(Array.isArray(res.body.data.matches)).toBe(true);
        });
    });

    it('should return match scores with required fields', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: ['chicken', 'rice'],
        })
        .expect(200)
        .expect((res) => {
          const matches = res.body.data.matches;

          if (matches.length > 0) {
            const match = matches[0];
            expect(match).toHaveProperty('dishId');
            expect(match).toHaveProperty('score');
            expect(match).toHaveProperty('matchedIngredients');
            expect(match).toHaveProperty('missingIngredients');
            expect(match).toHaveProperty('substitutionMatches');
            expect(match).toHaveProperty('coveragePercentage');
          }
        });
    });

    it('should validate empty ingredients array', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: [],
        })
        .expect(400);
    });

    it('should validate missing ingredients field', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({})
        .expect(400);
    });

    it('should validate ingredients is an array', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: 'not-an-array',
        })
        .expect(400);
    });

    it('should respect minCoverage parameter', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: ['chicken'],
          minCoverage: 80,
        })
        .expect(200)
        .expect((res) => {
          const matches = res.body.data.matches;
          matches.forEach((match: any) => {
            expect(match.coveragePercentage).toBeGreaterThanOrEqual(80);
          });
        });
    });

    it('should handle allowSubstitutions parameter', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: ['shallot', 'garlic'], // shallot can substitute onion
          allowSubstitutions: true,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.matches).toBeDefined();
          // Should have matches when substitutions are allowed
        });
    });

    it('should handle exactMatchOnly parameter', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: ['chicken', 'rice'],
          exactMatchOnly: true,
        })
        .expect(200);
    });

    it('should sort results by score descending', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: ['chicken', 'onion', 'garlic', 'tomato'],
        })
        .expect(200)
        .expect((res) => {
          const matches = res.body.data.matches;

          for (let i = 1; i < matches.length; i++) {
            expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score);
          }
        });
    });

    it('should handle single ingredient search', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: ['chicken'],
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.matches.length).toBeGreaterThan(0);
        });
    });

    it('should handle many ingredients', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: [
            'chicken', 'onion', 'garlic', 'tomato', 'rice',
            'olive oil', 'salt', 'pepper', 'basil', 'oregano'
          ],
        })
        .expect(200);
    });

    it('should return timestamp in response', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: ['chicken'],
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('GET /api/ingredients/suggestions', () => {
    it('should return ingredient suggestions', () => {
      return request(app.getHttpServer())
        .get('/api/ingredients/suggestions?q=chick')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should filter suggestions by query', () => {
      return request(app.getHttpServer())
        .get('/api/ingredients/suggestions?q=tom')
        .expect(200)
        .expect((res) => {
          const suggestions = res.body.data;
          suggestions.forEach((suggestion: string) => {
            expect(suggestion.toLowerCase()).toContain('tom');
          });
        });
    });

    it('should require query parameter', () => {
      return request(app.getHttpServer())
        .get('/api/ingredients/suggestions')
        .expect(400);
    });

    it('should limit number of suggestions', () => {
      return request(app.getHttpServer())
        .get('/api/ingredients/suggestions?q=a')
        .expect(200)
        .expect((res) => {
          const suggestions = res.body.data;
          expect(suggestions.length).toBeLessThanOrEqual(20);
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', () => {
      return request(app.getHttpServer())
        .get('/api/unknown-route')
        .expect(404);
    });

    it('should handle malformed JSON', () => {
      return request(app.getHttpServer())
        .post('/api/dishes/match')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    it('should include error message in response', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/dishes/match')
        .send({
          ingredients: [],
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.headers['access-control-allow-origin']).toBeDefined();
        });
    });
  });

  describe('Response Format', () => {
    it('should wrap responses in ApiResponse format', () => {
      return request(app.getHttpServer())
        .get('/api/dishes/random')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });
});
