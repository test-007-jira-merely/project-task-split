import { MatchingAlgorithmService } from '../../src/domain/services/matching-algorithm.service';
import { SubstitutionMatrixService } from '../../src/domain/services/substitution-matrix.service';
import { Dish } from '@meal-platform/shared';

describe('MatchingAlgorithmService', () => {
  let service: MatchingAlgorithmService;
  let substitutionMatrix: SubstitutionMatrixService;

  beforeEach(() => {
    substitutionMatrix = new SubstitutionMatrixService();
    service = new MatchingAlgorithmService(substitutionMatrix);
  });

  describe('normalizeIngredient', () => {
    it('should normalize ingredient to lowercase', () => {
      const result = service.normalizeIngredient('TOMATO');
      expect(result.normalized).toBe('tomato');
    });

    it('should handle plurals', () => {
      const result = service.normalizeIngredient('tomatoes');
      expect(result.normalized).toBe('tomato');
    });

    it('should remove special characters', () => {
      const result = service.normalizeIngredient('chicken-breast!');
      expect(result.normalized).toBe('chicken breast');
    });
  });

  describe('fuzzyMatch', () => {
    it('should return 1.0 for exact matches', () => {
      const score = service.fuzzyMatch('tomato', 'tomato');
      expect(score).toBe(1.0);
    });

    it('should return high score for similar words', () => {
      const score = service.fuzzyMatch('tomato', 'tomatoe');
      expect(score).toBeGreaterThan(0.8);
    });

    it('should return lower score for different words', () => {
      const score = service.fuzzyMatch('tomato', 'potato');
      expect(score).toBeLessThan(0.7);
    });

    it('should handle substring matches', () => {
      const score = service.fuzzyMatch('chicken', 'chicken breast');
      expect(score).toBeGreaterThan(0.7);
    });
  });

  describe('computeDishScore', () => {
    const mockDish: Dish = {
      id: '1',
      name: 'Test Dish',
      description: 'Test',
      imageUrl: 'test.jpg',
      category: 'dinner',
      difficulty: 2,
      prepTime: 10,
      cookTime: 20,
      nutrition: { calories: 300, protein: 20, fat: 10, carbs: 30 },
      ingredients: [
        { id: '1', name: 'tomato', quantity: '2', unit: 'medium' },
        { id: '2', name: 'onion', quantity: '1', unit: 'large' },
        { id: '3', name: 'garlic', quantity: '3', unit: 'cloves' }
      ],
      instructions: ['Step 1', 'Step 2']
    };

    it('should return 100% coverage for perfect match', () => {
      const score = service.computeDishScore(
        ['tomato', 'onion', 'garlic'],
        mockDish,
        false,
        true
      );

      expect(score.coveragePercentage).toBe(100);
      expect(score.matchedIngredients).toHaveLength(3);
      expect(score.missingIngredients).toHaveLength(0);
    });

    it('should handle partial matches', () => {
      const score = service.computeDishScore(
        ['tomato', 'onion'],
        mockDish,
        false,
        true
      );

      expect(score.coveragePercentage).toBeCloseTo(66.67, 1);
      expect(score.matchedIngredients).toHaveLength(2);
      expect(score.missingIngredients).toHaveLength(1);
    });

    it('should handle fuzzy matches', () => {
      const score = service.computeDishScore(
        ['tomatoe', 'onion'],
        mockDish,
        false,
        false
      );

      expect(score.matchedIngredients.length).toBeGreaterThan(0);
    });

    it('should handle substitution matches', () => {
      const score = service.computeDishScore(
        ['shallot'], // substitute for onion
        mockDish,
        true,
        false
      );

      expect(score.substitutionMatches.length).toBeGreaterThan(0);
    });
  });

  describe('findMatches', () => {
    const mockDishes: Dish[] = [
      {
        id: '1',
        name: 'Tomato Salad',
        description: 'Fresh salad',
        imageUrl: 'test.jpg',
        category: 'lunch',
        difficulty: 1,
        prepTime: 10,
        cookTime: 0,
        nutrition: { calories: 150, protein: 5, fat: 8, carbs: 15 },
        ingredients: [
          { id: '1', name: 'tomato', quantity: '2', unit: 'medium' },
          { id: '2', name: 'cucumber', quantity: '1', unit: 'large' }
        ],
        instructions: ['Mix ingredients']
      },
      {
        id: '2',
        name: 'Onion Soup',
        description: 'French soup',
        imageUrl: 'test.jpg',
        category: 'dinner',
        difficulty: 3,
        prepTime: 15,
        cookTime: 45,
        nutrition: { calories: 250, protein: 10, fat: 12, carbs: 25 },
        ingredients: [
          { id: '3', name: 'onion', quantity: '4', unit: 'large' },
          { id: '4', name: 'butter', quantity: '2', unit: 'tbsp' }
        ],
        instructions: ['Caramelize onions', 'Add broth']
      }
    ];

    it('should return matches sorted by score', () => {
      const matches = service.findMatches(
        ['tomato', 'cucumber'],
        mockDishes,
        { allowSubstitutions: false }
      );

      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].dishId).toBe('1');
    });

    it('should filter by minimum coverage', () => {
      const matches = service.findMatches(
        ['tomato'],
        mockDishes,
        { minCoverage: 75, allowSubstitutions: false }
      );

      // Should not include dishes that don't meet coverage threshold
      const lowCoverageDish = matches.find(m => m.coveragePercentage < 75);
      expect(lowCoverageDish).toBeUndefined();
    });
  });

  describe('rankMatches', () => {
    it('should sort matches by score descending', () => {
      const matches = [
        {
          dishId: '1',
          score: 50,
          matchedIngredients: [],
          missingIngredients: [],
          substitutionMatches: [],
          coveragePercentage: 50
        },
        {
          dishId: '2',
          score: 90,
          matchedIngredients: [],
          missingIngredients: [],
          substitutionMatches: [],
          coveragePercentage: 90
        },
        {
          dishId: '3',
          score: 75,
          matchedIngredients: [],
          missingIngredients: [],
          substitutionMatches: [],
          coveragePercentage: 75
        }
      ];

      const ranked = service.rankMatches(matches);

      expect(ranked[0].dishId).toBe('2');
      expect(ranked[1].dishId).toBe('3');
      expect(ranked[2].dishId).toBe('1');
    });
  });
});
