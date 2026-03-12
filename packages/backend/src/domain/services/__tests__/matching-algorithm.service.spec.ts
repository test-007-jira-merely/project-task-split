import { Test, TestingModule } from '@nestjs/testing';
import { MatchingAlgorithmService } from '../matching-algorithm.service';
import { SubstitutionMatrixService } from '../substitution-matrix.service';
import { Dish } from '@meal-platform/shared';

// Mock helper to create test dishes
const createMockDish = (overrides: Partial<Dish> = {}): Dish => ({
  id: overrides.id || 'test-dish-1',
  name: overrides.name || 'Test Dish',
  description: 'A test dish',
  imageUrl: 'https://example.com/image.jpg',
  ingredients: overrides.ingredients || [
    { id: '1', name: 'chicken', quantity: '500', unit: 'g', substitutes: [] },
    { id: '2', name: 'onion', quantity: '1', unit: 'piece', substitutes: [] },
  ],
  instructions: ['Cook it'],
  category: 'lunch',
  difficulty: 2,
  prepTime: 15,
  cookTime: 30,
  nutrition: {
    calories: 400,
    protein: 30,
    fat: 15,
    carbs: 35,
  },
  tags: [],
  ...overrides,
});

describe('MatchingAlgorithmService', () => {
  let service: MatchingAlgorithmService;
  let substitutionMatrix: SubstitutionMatrixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingAlgorithmService,
        {
          provide: SubstitutionMatrixService,
          useValue: {
            getConfidence: jest.fn((ing1: string, ing2: string) => {
              // Mock substitution logic
              const substitutions: Record<string, string[]> = {
                'shallot': ['onion'],
                'onion': ['shallot'],
                'butter': ['oil'],
                'oil': ['butter'],
              };
              if (substitutions[ing1]?.includes(ing2)) {
                return 0.85;
              }
              return 0;
            }),
            canSubstitute: jest.fn(),
            getSubstitutes: jest.fn(),
            load: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchingAlgorithmService>(MatchingAlgorithmService);
    substitutionMatrix = module.get<SubstitutionMatrixService>(SubstitutionMatrixService);
  });

  describe('normalizeIngredient', () => {
    it('should convert to lowercase', () => {
      const result = service.normalizeIngredient('Chicken Breast');
      expect(result.normalized).toBe('chicken breast');
    });

    it('should trim whitespace', () => {
      const result = service.normalizeIngredient('  garlic  ');
      expect(result.normalized).toBe('garlic');
    });

    it('should remove special characters', () => {
      const result = service.normalizeIngredient('salt & pepper');
      expect(result.normalized).toBe('salt  pepper');
    });

    it('should handle plurals ending in "ies"', () => {
      const result = service.normalizeIngredient('berries');
      expect(result.normalized).toBe('berry');
    });

    it('should handle plurals ending in "oes"', () => {
      const result = service.normalizeIngredient('tomatoes');
      expect(result.normalized).toBe('tomato');
    });

    it('should handle plurals ending in "s"', () => {
      const result = service.normalizeIngredient('carrots');
      expect(result.normalized).toBe('carrot');
    });

    it('should map synonyms for tomato', () => {
      const result = service.normalizeIngredient('tomato');
      expect(result.synonyms).toContain('tomatoes');
      expect(result.synonyms).toContain('cherry tomato');
    });

    it('should map synonyms for cilantro to coriander', () => {
      const result = service.normalizeIngredient('cilantro');
      expect(result.synonyms).toContain('coriander');
    });

    it('should preserve original value', () => {
      const result = service.normalizeIngredient('Chicken Breast');
      expect(result.original).toBe('Chicken Breast');
    });
  });

  describe('fuzzyMatch', () => {
    it('should return 1.0 for exact match', () => {
      const score = service.fuzzyMatch('onion', 'onion');
      expect(score).toBe(1.0);
    });

    it('should return 1.0 for exact match regardless of case', () => {
      const score = service.fuzzyMatch('Onion', 'onion');
      expect(score).toBe(1.0);
    });

    it('should return high score for similar words', () => {
      const score = service.fuzzyMatch('tomato', 'tomatoe');
      expect(score).toBeGreaterThan(0.8);
    });

    it('should return high score when one string contains the other', () => {
      const score = service.fuzzyMatch('chicken', 'chicken breast');
      expect(score).toBeGreaterThan(0.5);
    });

    it('should return low score for different words', () => {
      const score = service.fuzzyMatch('chicken', 'beef');
      expect(score).toBeLessThan(0.5);
    });

    it('should handle empty strings', () => {
      const score = service.fuzzyMatch('', '');
      expect(score).toBe(1.0);
    });

    it('should calculate Levenshtein distance correctly', () => {
      const score = service.fuzzyMatch('kitten', 'sitting');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1);
    });
  });

  describe('findMatches', () => {
    const mockDishes: Dish[] = [
      createMockDish({
        id: '1',
        name: 'Chicken Stir Fry',
        ingredients: [
          { id: '1', name: 'chicken', quantity: '500', unit: 'g', substitutes: [] },
          { id: '2', name: 'onion', quantity: '1', unit: 'piece', substitutes: [] },
          { id: '3', name: 'garlic', quantity: '2', unit: 'cloves', substitutes: [] },
        ],
      }),
      createMockDish({
        id: '2',
        name: 'Beef Stew',
        ingredients: [
          { id: '4', name: 'beef', quantity: '500', unit: 'g', substitutes: [] },
          { id: '5', name: 'carrot', quantity: '3', unit: 'pieces', substitutes: [] },
          { id: '6', name: 'potato', quantity: '2', unit: 'pieces', substitutes: [] },
        ],
      }),
      createMockDish({
        id: '3',
        name: 'Garlic Bread',
        ingredients: [
          { id: '7', name: 'bread', quantity: '1', unit: 'loaf', substitutes: [] },
          { id: '8', name: 'garlic', quantity: '4', unit: 'cloves', substitutes: [] },
          { id: '9', name: 'butter', quantity: '50', unit: 'g', substitutes: [] },
        ],
      }),
    ];

    it('should find exact matches', () => {
      const results = service.findMatches(
        ['chicken', 'onion', 'garlic'],
        mockDishes,
        { exactMatchOnly: false }
      );

      expect(results.length).toBeGreaterThan(0);
      const topMatch = results[0];
      expect(topMatch.dishId).toBe('1');
      expect(topMatch.coveragePercentage).toBe(100);
    });

    it('should handle partial matches', () => {
      const results = service.findMatches(
        ['chicken', 'onion'],
        mockDishes,
        { exactMatchOnly: false }
      );

      const chickenDish = results.find(r => r.dishId === '1');
      expect(chickenDish).toBeDefined();
      expect(chickenDish!.coveragePercentage).toBeGreaterThan(50);
      expect(chickenDish!.missingIngredients).toContain('garlic');
    });

    it('should support substitutions', () => {
      const results = service.findMatches(
        ['chicken', 'shallot', 'garlic'], // shallot substitutes onion
        mockDishes,
        { allowSubstitutions: true }
      );

      const chickenDish = results.find(r => r.dishId === '1');
      expect(chickenDish).toBeDefined();
      expect(chickenDish!.substitutionMatches.length).toBeGreaterThan(0);
    });

    it('should filter by minimum coverage', () => {
      const results = service.findMatches(
        ['chicken'],
        mockDishes,
        { minCoverage: 80 }
      );

      results.forEach(result => {
        expect(result.coveragePercentage).toBeGreaterThanOrEqual(80);
      });
    });

    it('should rank results by score', () => {
      const results = service.findMatches(
        ['garlic', 'butter'],
        mockDishes,
        {}
      );

      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('should respect exactMatchOnly option', () => {
      const results = service.findMatches(
        ['chickn'], // typo
        mockDishes,
        { exactMatchOnly: true }
      );

      // Should not match due to typo with exact match only
      const chickenDish = results.find(r => r.dishId === '1');
      expect(chickenDish?.coveragePercentage || 0).toBeLessThan(100);
    });

    it('should respect fuzzyThreshold option', () => {
      const results = service.findMatches(
        ['chickn'], // typo
        mockDishes,
        { exactMatchOnly: false, fuzzyThreshold: 0.95 }
      );

      // High threshold should reject fuzzy matches
      const chickenDish = results.find(r => r.dishId === '1');
      if (chickenDish) {
        expect(chickenDish.coveragePercentage).toBeLessThan(100);
      }
    });

    it('should return empty array when no dishes match', () => {
      const results = service.findMatches(
        ['pineapple', 'kiwi'],
        mockDishes,
        { minCoverage: 100 }
      );

      expect(results).toEqual([]);
    });
  });

  describe('computeDishScore', () => {
    it('should return 100% coverage for complete match', () => {
      const dish = createMockDish({
        ingredients: [
          { id: '1', name: 'chicken', quantity: '500', unit: 'g', substitutes: [] },
          { id: '2', name: 'onion', quantity: '1', unit: 'piece', substitutes: [] },
        ],
      });

      const score = service.computeDishScore(
        ['chicken', 'onion'],
        dish,
        false
      );

      expect(score.coveragePercentage).toBe(100);
      expect(score.missingIngredients).toHaveLength(0);
    });

    it('should identify missing ingredients', () => {
      const dish = createMockDish({
        ingredients: [
          { id: '1', name: 'chicken', quantity: '500', unit: 'g', substitutes: [] },
          { id: '2', name: 'onion', quantity: '1', unit: 'piece', substitutes: [] },
          { id: '3', name: 'garlic', quantity: '2', unit: 'cloves', substitutes: [] },
        ],
      });

      const score = service.computeDishScore(
        ['chicken'],
        dish,
        false
      );

      expect(score.missingIngredients).toContain('onion');
      expect(score.missingIngredients).toContain('garlic');
      expect(score.matchedIngredients).toContain('chicken');
    });

    it('should calculate coverage percentage correctly', () => {
      const dish = createMockDish({
        ingredients: [
          { id: '1', name: 'chicken', quantity: '500', unit: 'g', substitutes: [] },
          { id: '2', name: 'onion', quantity: '1', unit: 'piece', substitutes: [] },
          { id: '3', name: 'garlic', quantity: '2', unit: 'cloves', substitutes: [] },
          { id: '4', name: 'carrot', quantity: '2', unit: 'pieces', substitutes: [] },
        ],
      });

      const score = service.computeDishScore(
        ['chicken', 'onion'],
        dish,
        false
      );

      expect(score.coveragePercentage).toBe(50); // 2 out of 4
    });

    it('should handle substitution matches', () => {
      const dish = createMockDish({
        ingredients: [
          { id: '1', name: 'chicken', quantity: '500', unit: 'g', substitutes: [] },
          { id: '2', name: 'onion', quantity: '1', unit: 'piece', substitutes: [] },
        ],
      });

      const score = service.computeDishScore(
        ['chicken', 'shallot'], // shallot substitutes onion
        dish,
        true // allow substitutions
      );

      expect(score.coveragePercentage).toBeGreaterThan(0);
      expect(score.substitutionMatches.length).toBeGreaterThan(0);
    });

    it('should return dish ID in score', () => {
      const dish = createMockDish({ id: 'test-123' });
      const score = service.computeDishScore(['chicken'], dish, false);
      expect(score.dishId).toBe('test-123');
    });

    it('should calculate score based on coverage and confidence', () => {
      const dish = createMockDish({
        ingredients: [
          { id: '1', name: 'chicken', quantity: '500', unit: 'g', substitutes: [] },
          { id: '2', name: 'onion', quantity: '1', unit: 'piece', substitutes: [] },
        ],
      });

      const score = service.computeDishScore(
        ['chicken', 'onion'],
        dish,
        false
      );

      expect(score.score).toBeGreaterThan(0);
      expect(score.score).toBeLessThanOrEqual(100);
    });

    it('should handle fuzzy matches when not in exact match mode', () => {
      const dish = createMockDish({
        ingredients: [
          { id: '1', name: 'tomato', quantity: '2', unit: 'pieces', substitutes: [] },
        ],
      });

      const score = service.computeDishScore(
        ['tomatoe'], // typo
        dish,
        false,
        false, // not exact match only
        0.8
      );

      expect(score.matchedIngredients.length).toBeGreaterThan(0);
    });
  });

  describe('rankMatches', () => {
    it('should sort by score descending', () => {
      const matches = [
        {
          dishId: '1',
          score: 50,
          matchedIngredients: [],
          missingIngredients: [],
          substitutionMatches: [],
          coveragePercentage: 50,
        },
        {
          dishId: '2',
          score: 90,
          matchedIngredients: [],
          missingIngredients: [],
          substitutionMatches: [],
          coveragePercentage: 90,
        },
        {
          dishId: '3',
          score: 70,
          matchedIngredients: [],
          missingIngredients: [],
          substitutionMatches: [],
          coveragePercentage: 70,
        },
      ];

      const ranked = service.rankMatches(matches);

      expect(ranked[0].dishId).toBe('2');
      expect(ranked[1].dishId).toBe('3');
      expect(ranked[2].dishId).toBe('1');
    });

    it('should use coverage as secondary sort criterion', () => {
      const matches = [
        {
          dishId: '1',
          score: 80,
          matchedIngredients: [],
          missingIngredients: ['a', 'b'],
          substitutionMatches: [],
          coveragePercentage: 60,
        },
        {
          dishId: '2',
          score: 80,
          matchedIngredients: [],
          missingIngredients: ['a'],
          substitutionMatches: [],
          coveragePercentage: 80,
        },
      ];

      const ranked = service.rankMatches(matches);

      expect(ranked[0].dishId).toBe('2'); // Higher coverage
    });

    it('should use missing ingredients count as tertiary criterion', () => {
      const matches = [
        {
          dishId: '1',
          score: 80,
          matchedIngredients: [],
          missingIngredients: ['a', 'b', 'c'],
          substitutionMatches: [],
          coveragePercentage: 80,
        },
        {
          dishId: '2',
          score: 80,
          matchedIngredients: [],
          missingIngredients: ['a'],
          substitutionMatches: [],
          coveragePercentage: 80,
        },
      ];

      const ranked = service.rankMatches(matches);

      expect(ranked[0].dishId).toBe('2'); // Fewer missing ingredients
    });
  });
});
