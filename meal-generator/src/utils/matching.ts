import type { Meal, IngredientMatch } from '../types';
import { normalizeIngredients, ingredientsMatch } from './normalization';

export const calculateIngredientMatch = (
  availableIngredients: string[],
  mealIngredients: string[]
): { matchPercentage: number; matchedIngredients: string[]; missingIngredients: string[] } => {
  const normalizedAvailable = normalizeIngredients(availableIngredients);
  const normalizedMeal = normalizeIngredients(mealIngredients);

  if (normalizedMeal.length === 0) {
    return { matchPercentage: 0, matchedIngredients: [], missingIngredients: [] };
  }

  const matched: string[] = [];
  const missing: string[] = [];

  normalizedMeal.forEach((mealIng) => {
    const isMatched = normalizedAvailable.some((availIng) =>
      ingredientsMatch(availIng, mealIng)
    );

    if (isMatched) {
      matched.push(mealIng);
    } else {
      missing.push(mealIng);
    }
  });

  const matchPercentage = Math.round((matched.length / normalizedMeal.length) * 100);

  return {
    matchPercentage,
    matchedIngredients: matched,
    missingIngredients: missing,
  };
};

export const filterMealsByIngredients = (
  meals: Meal[],
  ingredients: string[],
  minMatchPercentage: number = 0
): IngredientMatch[] => {
  if (ingredients.length === 0) {
    return [];
  }

  const matches: IngredientMatch[] = meals
    .map((meal) => {
      const match = calculateIngredientMatch(ingredients, meal.ingredients);
      return {
        meal,
        ...match,
      };
    })
    .filter((match) => match.matchPercentage >= minMatchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return matches;
};

export const getRandomMeal = (meals: Meal[], excludeId?: string): Meal | null => {
  const availableMeals = excludeId
    ? meals.filter((meal) => meal.id !== excludeId)
    : meals;

  if (availableMeals.length === 0) {
    return meals.length > 0 ? meals[Math.floor(Math.random() * meals.length)] : null;
  }

  return availableMeals[Math.floor(Math.random() * availableMeals.length)];
};
