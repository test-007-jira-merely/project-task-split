import type { Meal, IngredientMatch } from '../types';

export function normalizeIngredient(ingredient: string): string {
  return ingredient.toLowerCase().trim();
}

export function calculateMatchPercentage(
  mealIngredients: string[],
  availableIngredients: string[]
): number {
  if (mealIngredients.length === 0) return 0;

  const normalizedAvailable = availableIngredients.map(normalizeIngredient);
  const normalizedMeal = mealIngredients.map(normalizeIngredient);

  const matchCount = normalizedMeal.filter(ingredient =>
    normalizedAvailable.some(available =>
      ingredient.includes(available) || available.includes(ingredient)
    )
  ).length;

  return Math.round((matchCount / normalizedMeal.length) * 100);
}

export function findMatchedIngredients(
  mealIngredients: string[],
  availableIngredients: string[]
): { matched: string[]; missing: string[] } {
  const normalizedAvailable = availableIngredients.map(normalizeIngredient);
  const matched: string[] = [];
  const missing: string[] = [];

  mealIngredients.forEach(ingredient => {
    const normalized = normalizeIngredient(ingredient);
    const isMatched = normalizedAvailable.some(available =>
      normalized.includes(available) || available.includes(normalized)
    );

    if (isMatched) {
      matched.push(ingredient);
    } else {
      missing.push(ingredient);
    }
  });

  return { matched, missing };
}

export function filterMealsByIngredients(
  meals: Meal[],
  ingredients: string[],
  minMatchPercentage: number = 0
): IngredientMatch[] {
  if (ingredients.length === 0) {
    return meals.map(meal => ({
      meal,
      matchPercentage: 100,
      matchedIngredients: meal.ingredients,
      missingIngredients: [],
    }));
  }

  const matches: IngredientMatch[] = meals.map(meal => {
    const matchPercentage = calculateMatchPercentage(meal.ingredients, ingredients);
    const { matched, missing } = findMatchedIngredients(meal.ingredients, ingredients);

    return {
      meal,
      matchPercentage,
      matchedIngredients: matched,
      missingIngredients: missing,
    };
  });

  return matches
    .filter(match => match.matchPercentage >= minMatchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function getUniqueIngredients(meals: Meal[]): string[] {
  const allIngredients = meals.flatMap(meal => meal.ingredients);
  const normalized = allIngredients.map(normalizeIngredient);
  return Array.from(new Set(normalized)).sort();
}
