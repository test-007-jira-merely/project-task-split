import { Meal, MealMatch } from '../types/meal';

/**
 * Normalizes a string by converting to lowercase and trimming whitespace
 */
export const normalizeString = (str: string): string => {
  return str.toLowerCase().trim();
};

/**
 * Removes duplicate ingredients from an array (case-insensitive)
 */
export const removeDuplicateIngredients = (ingredients: string[]): string[] => {
  const normalized = ingredients.map(normalizeString);
  return ingredients.filter((ingredient, index) => {
    return normalized.indexOf(normalizeString(ingredient)) === index;
  });
};

/**
 * Calculates the match percentage between user ingredients and meal ingredients
 * @param userIngredients - Ingredients the user has
 * @param mealIngredients - Ingredients required for the meal
 * @returns Match percentage (0-100)
 */
export const calculateMatchPercentage = (
  userIngredients: string[],
  mealIngredients: string[]
): number => {
  if (mealIngredients.length === 0) return 0;

  const normalizedUserIngredients = userIngredients.map(normalizeString);
  const normalizedMealIngredients = mealIngredients.map(normalizeString);

  let matchCount = 0;

  for (const mealIngredient of normalizedMealIngredients) {
    // Check for exact match or partial match (contains)
    const hasMatch = normalizedUserIngredients.some(userIngredient => {
      return userIngredient.includes(mealIngredient) || mealIngredient.includes(userIngredient);
    });

    if (hasMatch) {
      matchCount++;
    }
  }

  return Math.round((matchCount / mealIngredients.length) * 100);
};

/**
 * Filters meals based on user ingredients and returns matches with percentages
 * @param meals - All available meals
 * @param userIngredients - Ingredients the user has
 * @param minMatchPercentage - Minimum match percentage to include (default: 0)
 * @returns Array of meal matches sorted by match percentage (descending)
 */
export const filterMealsByIngredients = (
  meals: Meal[],
  userIngredients: string[],
  minMatchPercentage: number = 0
): MealMatch[] => {
  if (userIngredients.length === 0) {
    return [];
  }

  const uniqueUserIngredients = removeDuplicateIngredients(userIngredients);

  const matches: MealMatch[] = meals.map(meal => ({
    ...meal,
    matchPercentage: calculateMatchPercentage(uniqueUserIngredients, meal.ingredients),
  }));

  // Filter by minimum match percentage and sort descending
  return matches
    .filter(match => match.matchPercentage >= minMatchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
};

/**
 * Checks if a meal can be made with only the provided ingredients (100% match)
 * @param meal - The meal to check
 * @param userIngredients - Ingredients the user has
 * @returns True if all meal ingredients are covered by user ingredients
 */
export const canMakeMeal = (meal: Meal, userIngredients: string[]): boolean => {
  return calculateMatchPercentage(userIngredients, meal.ingredients) === 100;
};
