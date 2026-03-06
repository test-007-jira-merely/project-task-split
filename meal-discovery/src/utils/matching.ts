import { Meal } from '@/types';
import { IMatchingEngine } from '@/types/services';
import { normalizeString, normalizeIngredients, ingredientsMatch } from './normalization';

class MatchingEngine implements IMatchingEngine {
  normalizeString(input: string): string {
    return normalizeString(input);
  }

  calculateMatchPercentage(mealIngredients: string[], availableIngredients: string[]): number {
    if (mealIngredients.length === 0) return 0;

    const normalizedMealIngredients = normalizeIngredients(mealIngredients);
    const normalizedAvailableIngredients = normalizeIngredients(availableIngredients);

    let matchCount = 0;

    for (const mealIng of normalizedMealIngredients) {
      for (const availableIng of normalizedAvailableIngredients) {
        if (ingredientsMatch(mealIng, availableIng)) {
          matchCount++;
          break;
        }
      }
    }

    return Math.round((matchCount / normalizedMealIngredients.length) * 100);
  }

  filterMealsByIngredients(meals: Meal[], ingredients: string[]): Array<{ meal: Meal; matchPercentage: number }> {
    if (ingredients.length === 0) {
      return meals.map(meal => ({ meal, matchPercentage: 100 }));
    }

    const results = meals
      .map(meal => ({
        meal,
        matchPercentage: this.calculateMatchPercentage(meal.ingredients, ingredients),
      }))
      .filter(result => result.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return results;
  }

  extractUniqueIngredients(meals: Meal[]): string[] {
    const allIngredients = meals.flatMap(meal => meal.ingredients);
    const normalized = normalizeIngredients(allIngredients);
    return normalized.sort();
  }
}

export const matchingEngine = new MatchingEngine();
