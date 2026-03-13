import type { Meal, MealMatch } from '@/types/meal';

export function normalizeIngredient(ingredient: string): string {
  return ingredient.toLowerCase().trim();
}

export function calculateMatch(
  mealIngredients: string[],
  availableIngredients: string[]
): {
  percentage: number;
  matched: string[];
  missing: string[];
} {
  const normalizedAvailable = availableIngredients.map(normalizeIngredient);
  const normalizedMeal = mealIngredients.map(normalizeIngredient);

  const matched = normalizedMeal.filter((ing) =>
    normalizedAvailable.some((avail) => avail.includes(ing) || ing.includes(avail))
  );

  const missing = normalizedMeal.filter((ing) =>
    !normalizedAvailable.some((avail) => avail.includes(ing) || ing.includes(avail))
  );

  const percentage = mealIngredients.length > 0
    ? Math.round((matched.length / mealIngredients.length) * 100)
    : 0;

  // Map back to original ingredient names
  const matchedOriginal = mealIngredients.filter((_, idx) =>
    matched.includes(normalizedMeal[idx])
  );
  const missingOriginal = mealIngredients.filter((_, idx) =>
    missing.includes(normalizedMeal[idx])
  );

  return {
    percentage,
    matched: matchedOriginal,
    missing: missingOriginal,
  };
}

export function filterMealsByIngredients(
  meals: Meal[],
  ingredients: string[]
): MealMatch[] {
  if (ingredients.length === 0) {
    return meals.map((meal) => ({
      ...meal,
      matchPercentage: 100,
      matchedIngredients: meal.ingredients,
      missingIngredients: [],
    }));
  }

  return meals
    .map((meal) => {
      const match = calculateMatch(meal.ingredients, ingredients);
      return {
        ...meal,
        matchPercentage: match.percentage,
        matchedIngredients: match.matched,
        missingIngredients: match.missing,
      };
    })
    .filter((meal) => meal.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function getAllIngredientsFromMeals(meals: Meal[]): string[] {
  const allIngredients = new Set<string>();
  meals.forEach((meal) => {
    meal.ingredients.forEach((ing) => {
      allIngredients.add(normalizeIngredient(ing));
    });
  });
  return Array.from(allIngredients).sort();
}
