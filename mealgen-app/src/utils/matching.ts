// Ingredient matching and filtering utilities

import type { Meal, MealWithMatch, IngredientMatch, MealFilters, SortOption } from '../types';

/**
 * Normalize a string for ingredient matching
 * - Convert to lowercase
 * - Trim whitespace
 * - Remove special characters
 */
export function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '');
}

/**
 * Calculate match percentage between user ingredients and meal ingredients
 */
export function calculateMatchPercentage(
  userIngredients: string[],
  mealIngredients: string[]
): number {
  if (mealIngredients.length === 0) return 0;

  const normalizedUserIngredients = userIngredients.map(normalizeIngredient);
  const normalizedMealIngredients = mealIngredients.map(normalizeIngredient);

  const matchedCount = normalizedMealIngredients.filter(mealIng =>
    normalizedUserIngredients.some(userIng =>
      userIng.includes(mealIng) || mealIng.includes(userIng)
    )
  ).length;

  return Math.round((matchedCount / normalizedMealIngredients.length) * 100);
}

/**
 * Get detailed ingredient match information
 */
export function getIngredientMatch(
  userIngredients: string[],
  meal: Meal
): IngredientMatch {
  const normalizedUserIngredients = userIngredients.map(normalizeIngredient);
  const normalizedMealIngredients = meal.ingredients.map(normalizeIngredient);

  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];

  meal.ingredients.forEach((mealIng, index) => {
    const normalizedMealIng = normalizedMealIngredients[index];
    const isMatched = normalizedUserIngredients.some(userIng =>
      userIng.includes(normalizedMealIng) || normalizedMealIng.includes(userIng)
    );

    if (isMatched) {
      matchedIngredients.push(mealIng);
    } else {
      missingIngredients.push(mealIng);
    }
  });

  const matchPercentage = meal.ingredients.length > 0
    ? Math.round((matchedIngredients.length / meal.ingredients.length) * 100)
    : 0;

  return {
    meal,
    matchPercentage,
    matchedIngredients,
    missingIngredients,
  };
}

/**
 * Filter meals based on user ingredients and filters
 */
export function filterMeals(
  meals: Meal[],
  userIngredients: string[],
  filters?: MealFilters
): MealWithMatch[] {
  let filtered = meals;

  // Filter by category
  if (filters?.category) {
    filtered = filtered.filter(meal => meal.category === filters.category);
  }

  // Filter by difficulty
  if (filters?.difficulty) {
    filtered = filtered.filter(meal => meal.difficulty === filters.difficulty);
  }

  // Calculate matches for all filtered meals
  const mealsWithMatch: MealWithMatch[] = filtered.map(meal => {
    if (userIngredients.length === 0) {
      return meal;
    }

    const match = getIngredientMatch(userIngredients, meal);
    return {
      ...meal,
      matchPercentage: match.matchPercentage,
      matchedIngredients: match.matchedIngredients,
      missingIngredients: match.missingIngredients,
    };
  });

  // Filter by minimum match percentage
  if (filters?.minMatchPercentage !== undefined && userIngredients.length > 0) {
    return mealsWithMatch.filter(
      meal => (meal.matchPercentage ?? 0) >= filters.minMatchPercentage!
    );
  }

  return mealsWithMatch;
}

/**
 * Sort meals based on sort option
 */
export function sortMeals(
  meals: MealWithMatch[],
  sortOption: SortOption
): MealWithMatch[] {
  const sorted = [...meals];

  switch (sortOption) {
    case 'match':
      return sorted.sort((a, b) =>
        (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0)
      );

    case 'category':
      return sorted.sort((a, b) =>
        a.category.localeCompare(b.category)
      );

    case 'name':
      return sorted.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

    case 'random':
      return sorted.sort(() => Math.random() - 0.5);

    default:
      return sorted;
  }
}

/**
 * Get unique ingredients from all meals (for suggestions)
 */
export function getUniqueIngredients(meals: Meal[]): string[] {
  const allIngredients = meals.flatMap(meal => meal.ingredients);
  const uniqueIngredients = Array.from(new Set(
    allIngredients.map(normalizeIngredient)
  ));
  return uniqueIngredients.sort();
}

/**
 * Get ingredient suggestions based on partial input
 */
export function getIngredientSuggestions(
  meals: Meal[],
  input: string,
  limit = 10
): string[] {
  if (!input.trim()) return [];

  const normalizedInput = normalizeIngredient(input);
  const allIngredients = meals.flatMap(meal => meal.ingredients);
  const uniqueIngredients = Array.from(new Set(allIngredients));

  const suggestions = uniqueIngredients
    .filter(ingredient =>
      normalizeIngredient(ingredient).includes(normalizedInput)
    )
    .slice(0, limit);

  return suggestions;
}

/**
 * Select a random meal from the list, avoiding the last generated meal
 */
export function selectRandomMeal(
  meals: Meal[],
  lastGeneratedMealId?: string | null
): Meal | null {
  if (meals.length === 0) return null;
  if (meals.length === 1) return meals[0];

  const availableMeals = lastGeneratedMealId
    ? meals.filter(meal => meal.id !== lastGeneratedMealId)
    : meals;

  if (availableMeals.length === 0) {
    return meals[Math.floor(Math.random() * meals.length)];
  }

  return availableMeals[Math.floor(Math.random() * availableMeals.length)];
}
