import type { Meal, IngredientMatch, FilterOptions } from '../types';
import { normalizeIngredient } from './normalization';

export function calculateIngredientMatch(
  mealIngredients: string[],
  userIngredients: string[]
): {
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
} {
  const normalizedMealIngredients = mealIngredients.map(normalizeIngredient);
  const normalizedUserIngredients = userIngredients.map(normalizeIngredient);

  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];

  normalizedMealIngredients.forEach((mealIng, index) => {
    const isMatched = normalizedUserIngredients.some(userIng =>
      mealIng.includes(userIng) || userIng.includes(mealIng)
    );

    if (isMatched) {
      matchedIngredients.push(mealIngredients[index]);
    } else {
      missingIngredients.push(mealIngredients[index]);
    }
  });

  const matchPercentage = normalizedMealIngredients.length > 0
    ? Math.round((matchedIngredients.length / normalizedMealIngredients.length) * 100)
    : 0;

  return {
    matchPercentage,
    matchedIngredients,
    missingIngredients
  };
}

export function filterMealsByIngredients(
  meals: Meal[],
  userIngredients: string[]
): IngredientMatch[] {
  if (userIngredients.length === 0) {
    return [];
  }

  const matches: IngredientMatch[] = meals
    .map(meal => {
      const match = calculateIngredientMatch(meal.ingredients, userIngredients);
      return {
        meal,
        ...match
      };
    })
    .filter(match => match.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return matches;
}

export function filterMeals(meals: Meal[], filters: FilterOptions): Meal[] {
  let filtered = [...meals];

  if (filters.category) {
    filtered = filtered.filter(meal => meal.category === filters.category);
  }

  if (filters.difficulty) {
    filtered = filtered.filter(meal => meal.difficulty === filters.difficulty);
  }

  if (filters.maxPrepTime) {
    filtered = filtered.filter(meal =>
      meal.prepTime !== undefined && meal.prepTime <= filters.maxPrepTime!
    );
  }

  return filtered;
}

export function getRandomMeal(meals: Meal[], excludeId?: string | null): Meal | null {
  if (meals.length === 0) return null;

  let availableMeals = meals;

  if (excludeId && meals.length > 1) {
    availableMeals = meals.filter(meal => meal.id !== excludeId);
  }

  if (availableMeals.length === 0) {
    availableMeals = meals;
  }

  const randomIndex = Math.floor(Math.random() * availableMeals.length);
  return availableMeals[randomIndex];
}
