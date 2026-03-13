import type { Meal, MatchResult } from '@/types';

export function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

export function normalizeIngredients(ingredients: string[]): string[] {
  const normalized = ingredients.map(normalizeString);
  return Array.from(new Set(normalized)).filter(Boolean);
}

export function calculateMatchPercentage(
  recipeIngredients: string[],
  availableIngredients: string[]
): number {
  if (recipeIngredients.length === 0) return 0;

  const normalizedRecipe = normalizeIngredients(recipeIngredients);
  const normalizedAvailable = normalizeIngredients(availableIngredients);

  const matchCount = normalizedRecipe.filter(ingredient =>
    normalizedAvailable.some(available =>
      ingredient.includes(available) || available.includes(ingredient)
    )
  ).length;

  return Math.round((matchCount / normalizedRecipe.length) * 100);
}

export function findMatchingMeals(
  meals: Meal[],
  availableIngredients: string[]
): MatchResult[] {
  if (availableIngredients.length === 0) {
    return meals.map(meal => ({
      meal,
      matchPercentage: 0,
      matchedIngredients: [],
      missingIngredients: meal.ingredients,
    }));
  }

  const normalizedAvailable = normalizeIngredients(availableIngredients);

  return meals.map(meal => {
    const normalizedRecipe = normalizeIngredients(meal.ingredients);
    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];

    normalizedRecipe.forEach(ingredient => {
      const isMatched = normalizedAvailable.some(available =>
        ingredient.includes(available) || available.includes(ingredient)
      );

      if (isMatched) {
        matchedIngredients.push(ingredient);
      } else {
        missingIngredients.push(ingredient);
      }
    });

    const matchPercentage = normalizedRecipe.length > 0
      ? Math.round((matchedIngredients.length / normalizedRecipe.length) * 100)
      : 0;

    return {
      meal,
      matchPercentage,
      matchedIngredients,
      missingIngredients,
    };
  });
}

export function sortMatchResults(
  results: MatchResult[],
  sortBy: 'match' | 'random' | 'category'
): MatchResult[] {
  switch (sortBy) {
    case 'match':
      return [...results].sort((a, b) => b.matchPercentage - a.matchPercentage);
    case 'category':
      return [...results].sort((a, b) => a.meal.category.localeCompare(b.meal.category));
    case 'random':
      return [...results].sort(() => Math.random() - 0.5);
    default:
      return results;
  }
}
