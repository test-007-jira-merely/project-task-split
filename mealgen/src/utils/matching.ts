// Ingredient matching utility interface and algorithm contract

import type { Meal, IngredientMatch } from '../types';

/**
 * Normalizes an ingredient string for comparison
 * - Converts to lowercase
 * - Trims whitespace
 * - Removes special characters
 */
export function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '');
}

/**
 * Calculates ingredient match percentage between user ingredients and meal ingredients
 * Returns detailed match information
 */
export function calculateIngredientMatch(
  userIngredients: string[],
  meal: Meal
): IngredientMatch {
  const normalizedUserIngredients = userIngredients.map(normalizeIngredient);
  const normalizedMealIngredients = meal.ingredients.map(normalizeIngredient);

  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];

  meal.ingredients.forEach((mealIngredient, index) => {
    const normalized = normalizedMealIngredients[index];
    const isMatched = normalizedUserIngredients.some(userIng => {
      // Check for exact match or partial match (user has "chicken" and meal needs "chicken breast")
      return normalized.includes(userIng) || userIng.includes(normalized);
    });

    if (isMatched) {
      matchedIngredients.push(mealIngredient);
    } else {
      missingIngredients.push(mealIngredient);
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
 * Filters and sorts meals based on ingredient matches
 */
export function filterMealsByIngredients(
  meals: Meal[],
  userIngredients: string[]
): IngredientMatch[] {
  if (userIngredients.length === 0) {
    return [];
  }

  const matches = meals
    .map(meal => calculateIngredientMatch(userIngredients, meal))
    .filter(match => match.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return matches;
}

/**
 * Extracts unique ingredients from all meals for suggestion purposes
 */
export function extractUniqueIngredients(meals: Meal[]): string[] {
  const ingredientSet = new Set<string>();

  meals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      ingredientSet.add(ingredient.toLowerCase().trim());
    });
  });

  return Array.from(ingredientSet).sort();
}

/**
 * Suggests ingredients based on partial input
 */
export function suggestIngredients(
  input: string,
  allIngredients: string[],
  maxSuggestions: number = 10
): string[] {
  const normalizedInput = normalizeIngredient(input);

  if (normalizedInput.length < 2) {
    return [];
  }

  return allIngredients
    .filter(ingredient =>
      normalizeIngredient(ingredient).includes(normalizedInput)
    )
    .slice(0, maxSuggestions);
}
