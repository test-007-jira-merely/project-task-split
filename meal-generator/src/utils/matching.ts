import { normalizeString } from './normalization';
import type { Meal } from '../types';

export interface MatchResult {
  meal: Meal;
  matchPercentage: number;
  matchingIngredients: string[];
  missingIngredients: string[];
}

export const calculateIngredientMatch = (
  meal: Meal,
  availableIngredients: string[]
): MatchResult => {
  const normalizedAvailable = availableIngredients.map(normalizeString);
  const normalizedMealIngredients = meal.ingredients.map(normalizeString);

  const matchingIngredients = normalizedMealIngredients.filter((ingredient) =>
    normalizedAvailable.some((available) => ingredient.includes(available) || available.includes(ingredient))
  );

  const missingIngredients = normalizedMealIngredients.filter(
    (ingredient) => !matchingIngredients.includes(ingredient)
  );

  const matchPercentage = normalizedMealIngredients.length > 0
    ? Math.round((matchingIngredients.length / normalizedMealIngredients.length) * 100)
    : 0;

  return {
    meal,
    matchPercentage,
    matchingIngredients,
    missingIngredients,
  };
};

export const filterMealsByIngredients = (
  meals: Meal[],
  availableIngredients: string[]
): MatchResult[] => {
  if (availableIngredients.length === 0) {
    return meals.map((meal) => ({
      meal,
      matchPercentage: 0,
      matchingIngredients: [],
      missingIngredients: meal.ingredients,
    }));
  }

  return meals
    .map((meal) => calculateIngredientMatch(meal, availableIngredients))
    .filter((result) => result.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
};
