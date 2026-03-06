import type { Meal, MealWithMatch } from '@/types/meal.types';

export const normalizeIngredient = (ingredient: string): string => {
  return ingredient.toLowerCase().trim();
};

export const calculateMatchPercentage = (
  mealIngredients: string[],
  availableIngredients: string[]
): number => {
  if (mealIngredients.length === 0) return 0;

  const normalizedAvailable = availableIngredients.map(normalizeIngredient);
  const normalizedMeal = mealIngredients.map(normalizeIngredient);

  const matchCount = normalizedMeal.filter(ingredient =>
    normalizedAvailable.some(available =>
      ingredient.includes(available) || available.includes(ingredient)
    )
  ).length;

  return Math.round((matchCount / normalizedMeal.length) * 100);
};

export const filterMealsByIngredients = (
  meals: Meal[],
  availableIngredients: string[]
): MealWithMatch[] => {
  if (availableIngredients.length === 0) {
    return meals.map(meal => ({ ...meal, matchPercentage: 0 }));
  }

  return meals
    .map(meal => ({
      ...meal,
      matchPercentage: calculateMatchPercentage(meal.ingredients, availableIngredients)
    }))
    .filter(meal => meal.matchPercentage > 0);
};

export const sortByMatch = (meals: MealWithMatch[]): MealWithMatch[] => {
  return [...meals].sort((a, b) => b.matchPercentage - a.matchPercentage);
};
