import { Meal, MealMatch } from '@/types/meal';
import { normalizeIngredient } from './normalization';

export const calculateMatchPercentage = (
  mealIngredients: string[],
  availableIngredients: string[]
): number => {
  if (mealIngredients.length === 0) return 0;

  const normalizedMealIngredients = mealIngredients.map(normalizeIngredient);
  const normalizedAvailableIngredients = availableIngredients.map(normalizeIngredient);

  const matchedCount = normalizedMealIngredients.filter((ingredient) =>
    normalizedAvailableIngredients.some((available) =>
      ingredient.includes(available) || available.includes(ingredient)
    )
  ).length;

  return Math.round((matchedCount / normalizedMealIngredients.length) * 100);
};

export const getMatchedIngredients = (
  mealIngredients: string[],
  availableIngredients: string[]
): string[] => {
  const normalizedAvailableIngredients = availableIngredients.map(normalizeIngredient);

  return mealIngredients.filter((ingredient) => {
    const normalized = normalizeIngredient(ingredient);
    return normalizedAvailableIngredients.some(
      (available) => normalized.includes(available) || available.includes(normalized)
    );
  });
};

export const getMissingIngredients = (
  mealIngredients: string[],
  availableIngredients: string[]
): string[] => {
  const matched = getMatchedIngredients(mealIngredients, availableIngredients);
  return mealIngredients.filter((ingredient) => !matched.includes(ingredient));
};

export const enrichMealWithMatch = (
  meal: Meal,
  availableIngredients: string[]
): MealMatch => {
  const matchPercentage = calculateMatchPercentage(meal.ingredients, availableIngredients);
  const matchedIngredients = getMatchedIngredients(meal.ingredients, availableIngredients);
  const missingIngredients = getMissingIngredients(meal.ingredients, availableIngredients);

  return {
    ...meal,
    matchPercentage,
    matchedIngredients,
    missingIngredients,
  };
};
