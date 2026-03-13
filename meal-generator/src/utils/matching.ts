export function normalizeIngredient(ingredient: string): string {
  return ingredient.toLowerCase().trim();
}

export function normalizeIngredients(ingredients: string[]): string[] {
  const normalized = ingredients.map(normalizeIngredient);
  return Array.from(new Set(normalized));
}

export function calculateMatchPercentage(
  recipeIngredients: string[],
  availableIngredients: string[]
): number {
  if (recipeIngredients.length === 0) return 0;

  const normalizedRecipe = normalizeIngredients(recipeIngredients);
  const normalizedAvailable = normalizeIngredients(availableIngredients);

  const matches = normalizedRecipe.filter(ingredient =>
    normalizedAvailable.some(available =>
      ingredient.includes(available) || available.includes(ingredient)
    )
  );

  return Math.round((matches.length / normalizedRecipe.length) * 100);
}

export function filterMealsByIngredients(
  meals: any[],
  ingredients: string[]
): any[] {
  if (ingredients.length === 0) return meals;

  return meals
    .map(meal => ({
      ...meal,
      matchPercentage: calculateMatchPercentage(meal.ingredients, ingredients),
    }))
    .filter(meal => meal.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
