import type { Meal } from '@/types';
import mealsData from '@/data/meals.json';

export const mealService = {
  async getLocalMeals(): Promise<Meal[]> {
    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mealsData as Meal[]);
      }, 100);
    });
  },
};
