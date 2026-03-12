import type { Meal } from '@/types/meal.types';
import mealsData from '@/data/meals.json';

export const mealService = {
  getAllMeals: (): Meal[] => {
    return mealsData as Meal[];
  },

  getMealById: (id: string): Meal | undefined => {
    return mealsData.find(meal => meal.id === id) as Meal | undefined;
  },

  getRandomMeal: (excludeId?: string): Meal => {
    const meals = mealsData as Meal[];
    let availableMeals = meals;

    if (excludeId) {
      availableMeals = meals.filter(meal => meal.id !== excludeId);
    }

    const randomIndex = Math.floor(Math.random() * availableMeals.length);
    return availableMeals[randomIndex];
  },

  getMealsByCategory: (category: string): Meal[] => {
    return mealsData.filter(meal => meal.category === category) as Meal[];
  },

  getAllIngredients: (): string[] => {
    const ingredients = new Set<string>();
    mealsData.forEach(meal => {
      meal.ingredients.forEach(ing => ingredients.add(ing.toLowerCase().trim()));
    });
    return Array.from(ingredients).sort();
  }
};
