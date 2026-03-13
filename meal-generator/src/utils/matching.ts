import { normalizeString } from './normalization';
import type { Meal, MealMatch } from '@types/meal';

export function calculateIngredientMatch(
  mealIngredients: string[],
  availableIngredients: string[]
): { percentage: number; matched: string[]; missing: string[] } {
  if (mealIngredients.length === 0) {
    return { percentage: 0, matched: [], missing: [] };
  }

  const normalizedMealIngredients = mealIngredients.map(normalizeString);
  const normalizedAvailable = availableIngredients.map(normalizeString);

  const matched: string[] = [];
  const missing: string[] = [];

  normalizedMealIngredients.forEach((ingredient, index) => {
    const isMatched = normalizedAvailable.some(available =>
      ingredient.includes(available) || available.includes(ingredient)
    );

    if (isMatched) {
      matched.push(mealIngredients[index]);
    } else {
      missing.push(mealIngredients[index]);
    }
  });

  const percentage = Math.round((matched.length / normalizedMealIngredients.length) * 100);

  return { percentage, matched, missing };
}

export function filterMealsByIngredients(
  meals: Meal[],
  availableIngredients: string[]
): MealMatch[] {
  if (availableIngredients.length === 0) {
    return meals.map(meal => ({
      meal,
      matchPercentage: 0,
      matchedIngredients: [],
      missingIngredients: meal.ingredients,
    }));
  }

  const matches = meals.map(meal => {
    const { percentage, matched, missing } = calculateIngredientMatch(
      meal.ingredients,
      availableIngredients
    );

    return {
      meal,
      matchPercentage: percentage,
      matchedIngredients: matched,
      missingIngredients: missing,
    };
  });

  return matches
    .filter(match => match.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
