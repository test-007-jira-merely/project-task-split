import { Meal, MealWithMatch, IngredientMatch } from '@/types';
import type { IngredientMatcher } from '../../.contracts-beezi/utils/matching.types';

class IngredientMatcherImpl implements IngredientMatcher {
  normalizeIngredient(ingredient: string): string {
    return ingredient
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  calculateMatch(availableIngredients: string[], mealIngredients: string[]): IngredientMatch {
    const normalizedAvailable = availableIngredients.map(i => this.normalizeIngredient(i));
    const normalizedMeal = mealIngredients.map(i => this.normalizeIngredient(i));

    const matched: string[] = [];
    const missing: string[] = [];

    normalizedMeal.forEach((mealIng, index) => {
      const isMatched = normalizedAvailable.some(availIng =>
        mealIng.includes(availIng) || availIng.includes(mealIng)
      );

      if (isMatched) {
        matched.push(mealIngredients[index]);
      } else {
        missing.push(mealIngredients[index]);
      }
    });

    const percentage = normalizedMeal.length > 0
      ? Math.round((matched.length / normalizedMeal.length) * 100)
      : 0;

    return { matched, missing, percentage };
  }

  filterMealsByIngredients(meals: Meal[], availableIngredients: string[]): MealWithMatch[] {
    if (availableIngredients.length === 0) return [];

    const mealsWithMatch = meals.map(meal => {
      const match = this.calculateMatch(availableIngredients, meal.ingredients);
      return {
        ...meal,
        matchPercentage: match.percentage,
      };
    });

    return mealsWithMatch
      .filter(m => m.matchPercentage! > 0)
      .sort((a, b) => b.matchPercentage! - a.matchPercentage!);
  }

  getAllIngredients(meals: Meal[]): string[] {
    const allIngredients = new Set<string>();
    meals.forEach(meal => {
      meal.ingredients.forEach(ing => {
        allIngredients.add(this.normalizeIngredient(ing));
      });
    });
    return Array.from(allIngredients).sort();
  }

  suggestIngredients(partialInput: string, allIngredients: string[], maxSuggestions: number = 10): string[] {
    if (!partialInput.trim()) return [];

    const normalized = this.normalizeIngredient(partialInput);
    return allIngredients
      .filter(ing => ing.includes(normalized))
      .slice(0, maxSuggestions);
  }
}

export const ingredientMatcher = new IngredientMatcherImpl();
