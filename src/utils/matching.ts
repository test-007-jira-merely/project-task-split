export function normalizeIngredient(ingredient: string): string {
  return ingredient.toLowerCase().trim();
}

export function calculateMatchPercentage(
  availableIngredients: string[],
  mealIngredients: string[]
): number {
  if (mealIngredients.length === 0) return 0;

  const normalizedAvailable = availableIngredients.map(normalizeIngredient);
  const normalizedMeal = mealIngredients.map(normalizeIngredient);

  let matches = 0;
  for (const ingredient of normalizedMeal) {
    if (normalizedAvailable.some((available) =>
      ingredient.includes(available) || available.includes(ingredient)
    )) {
      matches++;
    }
  }

  return Math.round((matches / normalizedMeal.length) * 100);
}

export function filterMealsByIngredients(
  meals: any[],
  ingredients: string[],
  minMatchPercentage: number = 0
): any[] {
  if (ingredients.length === 0) return meals;

  return meals
    .map((meal) => ({
      ...meal,
      matchPercentage: calculateMatchPercentage(ingredients, meal.ingredients),
    }))
    .filter((meal) => meal.matchPercentage >= minMatchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
