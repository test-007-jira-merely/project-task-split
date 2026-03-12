import type { IIngredientMatcher } from '@/services/interfaces';
import type { Meal, IngredientMatch } from '@/types';

class IngredientMatcher implements IIngredientMatcher {
  private pluralMap: Record<string, string> = {
    'tomatoes': 'tomato',
    'potatoes': 'potato',
    'onions': 'onion',
    'carrots': 'carrot',
    'peppers': 'pepper',
    'eggs': 'egg',
    'apples': 'apple',
    'bananas': 'banana',
    'lemons': 'lemon',
  };

  normalizeIngredient(ingredient: string): string {
    const normalized = ingredient.toLowerCase().trim();
    return this.pluralMap[normalized] || normalized;
  }

  calculateMatch(mealIngredients: string[], selectedIngredients: string[]): {
    percentage: number;
    matched: string[];
    missing: string[];
  } {
    if (mealIngredients.length === 0) {
      return { percentage: 0, matched: [], missing: [] };
    }

    const normalizedMealIngredients = mealIngredients.map(i => this.normalizeIngredient(i));
    const normalizedSelected = selectedIngredients.map(i => this.normalizeIngredient(i));

    const matched: string[] = [];
    const missing: string[] = [];

    normalizedMealIngredients.forEach((ingredient, index) => {
      if (normalizedSelected.includes(ingredient)) {
        matched.push(mealIngredients[index]);
      } else {
        missing.push(mealIngredients[index]);
      }
    });

    const percentage = Math.round((matched.length / mealIngredients.length) * 100);

    return { percentage, matched, missing };
  }

  filterByIngredients(meals: Meal[], ingredients: string[]): IngredientMatch[] {
    if (ingredients.length === 0) {
      return [];
    }

    const matches: IngredientMatch[] = meals
      .map(meal => {
        const { percentage, matched, missing } = this.calculateMatch(
          meal.ingredients,
          ingredients
        );

        return {
          meal,
          matchPercentage: percentage,
          matchedIngredients: matched,
          missingIngredients: missing,
        };
      })
      .filter(match => match.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return matches;
  }

  getSuggestions(meals: Meal[], prefix: string): string[] {
    if (!prefix || prefix.length < 2) {
      return [];
    }

    const normalizedPrefix = prefix.toLowerCase().trim();
    const allIngredients = new Set<string>();

    meals.forEach(meal => {
      meal.ingredients.forEach(ingredient => {
        const normalized = ingredient.toLowerCase();
        if (normalized.includes(normalizedPrefix)) {
          allIngredients.add(ingredient);
        }
      });
    });

    return Array.from(allIngredients).slice(0, 10);
  }
}

export const ingredientMatcher = new IngredientMatcher();
