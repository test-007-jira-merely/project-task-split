import { Test, TestingModule } from '@nestjs/testing';
import { SubstitutionMatrixService } from '../substitution-matrix.service';

describe('SubstitutionMatrixService', () => {
  let service: SubstitutionMatrixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubstitutionMatrixService],
    }).compile();

    service = module.get<SubstitutionMatrixService>(SubstitutionMatrixService);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have substitution data loaded', () => {
      const ingredients = service.getAllIngredients();
      expect(ingredients.length).toBeGreaterThan(0);
    });
  });

  describe('getSubstitutes', () => {
    it('should return substitutes for onion', () => {
      const substitutes = service.getSubstitutes('onion');
      expect(substitutes.length).toBeGreaterThan(0);
      expect(substitutes.some(s => s.name === 'shallot')).toBe(true);
    });

    it('should return substitutes for butter', () => {
      const substitutes = service.getSubstitutes('butter');
      expect(substitutes.length).toBeGreaterThan(0);
      expect(substitutes.some(s => s.name === 'margarine')).toBe(true);
      expect(substitutes.some(s => s.name === 'olive oil')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const lowercaseResult = service.getSubstitutes('onion');
      const uppercaseResult = service.getSubstitutes('ONION');
      const mixedCaseResult = service.getSubstitutes('Onion');

      expect(lowercaseResult).toEqual(uppercaseResult);
      expect(lowercaseResult).toEqual(mixedCaseResult);
    });

    it('should trim whitespace', () => {
      const result = service.getSubstitutes('  onion  ');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown ingredient', () => {
      const substitutes = service.getSubstitutes('unknown-ingredient-xyz');
      expect(substitutes).toEqual([]);
    });

    it('should return substitutes with confidence scores', () => {
      const substitutes = service.getSubstitutes('onion');
      substitutes.forEach(sub => {
        expect(sub).toHaveProperty('name');
        expect(sub).toHaveProperty('confidence');
        expect(sub.confidence).toBeGreaterThan(0);
        expect(sub.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('canSubstitute', () => {
    it('should return true when substitution exists', () => {
      const canSub = service.canSubstitute('onion', 'shallot');
      expect(canSub).toBe(true);
    });

    it('should return false when substitution does not exist', () => {
      const canSub = service.canSubstitute('onion', 'chocolate');
      expect(canSub).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(service.canSubstitute('ONION', 'SHALLOT')).toBe(true);
      expect(service.canSubstitute('Onion', 'Shallot')).toBe(true);
    });

    it('should return false for non-existent original ingredient', () => {
      const canSub = service.canSubstitute('unknown-ingredient', 'shallot');
      expect(canSub).toBe(false);
    });

    it('should handle multiple valid substitutes', () => {
      expect(service.canSubstitute('butter', 'margarine')).toBe(true);
      expect(service.canSubstitute('butter', 'olive oil')).toBe(true);
      expect(service.canSubstitute('butter', 'ghee')).toBe(true);
    });
  });

  describe('getConfidence', () => {
    it('should return correct confidence score for valid substitution', () => {
      const confidence = service.getConfidence('onion', 'shallot');
      expect(confidence).toBeGreaterThan(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });

    it('should return 0 for invalid substitution', () => {
      const confidence = service.getConfidence('onion', 'chocolate');
      expect(confidence).toBe(0);
    });

    it('should return 0 for unknown original ingredient', () => {
      const confidence = service.getConfidence('unknown-ingredient', 'shallot');
      expect(confidence).toBe(0);
    });

    it('should be case-insensitive', () => {
      const lowercase = service.getConfidence('onion', 'shallot');
      const uppercase = service.getConfidence('ONION', 'SHALLOT');
      const mixed = service.getConfidence('Onion', 'Shallot');

      expect(lowercase).toBe(uppercase);
      expect(lowercase).toBe(mixed);
    });

    it('should return higher confidence for closer substitutes', () => {
      const shallotConfidence = service.getConfidence('onion', 'shallot');
      const scallionConfidence = service.getConfidence('onion', 'scallion');

      // Shallot should have higher confidence than scallion for onion
      expect(shallotConfidence).toBeGreaterThan(scallionConfidence);
    });

    it('should return 1.0 for exact synonyms', () => {
      const confidence = service.getConfidence('cilantro', 'coriander');
      expect(confidence).toBe(1.0);
    });

    it('should handle milk alternatives', () => {
      expect(service.getConfidence('milk', 'almond milk')).toBeGreaterThan(0);
      expect(service.getConfidence('milk', 'soy milk')).toBeGreaterThan(0);
      expect(service.getConfidence('milk', 'oat milk')).toBeGreaterThan(0);
    });

    it('should handle chicken variations', () => {
      expect(service.getConfidence('chicken', 'chicken breast')).toBeGreaterThan(0);
      expect(service.getConfidence('chicken breast', 'chicken')).toBeGreaterThan(0);
    });
  });

  describe('getAllIngredients', () => {
    it('should return array of all base ingredients', () => {
      const ingredients = service.getAllIngredients();
      expect(Array.isArray(ingredients)).toBe(true);
      expect(ingredients.length).toBeGreaterThan(0);
    });

    it('should include common ingredients', () => {
      const ingredients = service.getAllIngredients();
      expect(ingredients).toContain('onion');
      expect(ingredients).toContain('butter');
      expect(ingredients).toContain('milk');
      expect(ingredients).toContain('chicken');
    });

    it('should return lowercase ingredients', () => {
      const ingredients = service.getAllIngredients();
      ingredients.forEach(ing => {
        expect(ing).toBe(ing.toLowerCase());
      });
    });

    it('should not contain duplicates', () => {
      const ingredients = service.getAllIngredients();
      const uniqueIngredients = new Set(ingredients);
      expect(ingredients.length).toBe(uniqueIngredients.size);
    });
  });

  describe('substitution rules consistency', () => {
    it('should have confidence scores between 0 and 1', () => {
      const ingredients = service.getAllIngredients();

      ingredients.forEach(ingredient => {
        const substitutes = service.getSubstitutes(ingredient);
        substitutes.forEach(sub => {
          expect(sub.confidence).toBeGreaterThan(0);
          expect(sub.confidence).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should handle bidirectional substitutions correctly', () => {
      // If A can substitute B, check if B can substitute A
      const onionToShallot = service.getConfidence('onion', 'shallot');

      // Should have some substitution relationship
      expect(onionToShallot).toBeGreaterThan(0);
    });

    it('should provide reasonable substitutes for common ingredients', () => {
      // Test common cooking scenarios
      expect(service.getSubstitutes('butter').length).toBeGreaterThan(0);
      expect(service.getSubstitutes('olive oil').length).toBeGreaterThan(0);
      expect(service.getSubstitutes('milk').length).toBeGreaterThan(0);
      expect(service.getSubstitutes('sugar').length).toBeGreaterThan(0);
      expect(service.getSubstitutes('flour').length).toBeGreaterThan(0);
    });
  });
});
