import { Meal } from '@/types';

export const generateRandomMeal = (meals: Meal[], excludeId?: string | null): Meal | null => {
  if (meals.length === 0) return null;

  let availableMeals = meals;

  // Exclude last generated meal if possible
  if (excludeId && meals.length > 1) {
    availableMeals = meals.filter(meal => meal.id !== excludeId);
  }

  const randomIndex = Math.floor(Math.random() * availableMeals.length);
  return availableMeals[randomIndex];
};

export const getMealsByCategory = (meals: Meal[], category: string): Meal[] => {
  return meals.filter(meal => meal.category === category);
};

export const getMealsByIds = (meals: Meal[], ids: string[]): Meal[] => {
  return meals.filter(meal => ids.includes(meal.id));
};
