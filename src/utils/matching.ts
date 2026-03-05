import type { Meal, MealMatch } from '../types/meal';

/**
 * Normalizes a string by trimming whitespace and converting to lowercase
 */
const normalizeString = (str: string): string => {
  return str.trim().toLowerCase();
};

/**
 * Calculates the match percentage between user ingredients and meal ingredients
 */
export const calculateMatchPercentage = (
  mealIngredients: string[],
  userIngredients: string[]
): number => {
  if (mealIngredients.length === 0) return 0;

  const normalizedUserIngredients = userIngredients.map(normalizeString);
  const normalizedMealIngredients = mealIngredients.map(normalizeString);

  const matchedCount = normalizedMealIngredients.filter(ingredient =>
    normalizedUserIngredients.some(userIng =>
      userIng === ingredient || ingredient.includes(userIng) || userIng.includes(ingredient)
    )
  ).length;

  return Math.round((matchedCount / normalizedMealIngredients.length) * 100);
};

/**
 * Checks if a meal can be made with only the provided ingredients
 */
export const canMakeMeal = (
  meal: Meal,
  userIngredients: string[]
): boolean => {
  const matchPercentage = calculateMatchPercentage(meal.ingredients, userIngredients);
  return matchPercentage === 100;
};

/**
 * Filters meals based on user ingredients and returns matches with percentages
 */
export const filterMealsByIngredients = (
  meals: Meal[],
  userIngredients: string[]
): MealMatch[] => {
  if (userIngredients.length === 0) {
    return [];
  }

  const matches = meals
    .map(meal => ({
      ...meal,
      matchPercentage: calculateMatchPercentage(meal.ingredients, userIngredients)
    }))
    .filter(match => match.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return matches;
};

/**
 * Removes duplicate ingredients from a list
 */
export const removeDuplicateIngredients = (ingredients: string[]): string[] => {
  const normalized = ingredients.map(normalizeString);
  const unique = Array.from(new Set(normalized));
  return unique;
};
