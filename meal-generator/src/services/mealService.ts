import type { Meal, IngredientMatch, FilterOptions, SortOption } from '../types';
import { mealsService } from './supabase';
import { filterMealsByIngredients, filterMeals, getRandomMeal } from '../utils/matching';

export const mealService = {
  async getAllMeals(): Promise<Meal[]> {
    return await mealsService.getAllMeals();
  },

  async getMealById(id: string): Promise<Meal | null> {
    return await mealsService.getMealById(id);
  },

  async createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    return await mealsService.createMeal(meal);
  },

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    return await mealsService.updateMeal(id, meal);
  },

  async deleteMeal(id: string): Promise<void> {
    return await mealsService.deleteMeal(id);
  },

  async bulkImportMeals(meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    return await mealsService.bulkCreateMeals(meals);
  },

  async getRandomMeal(excludeId?: string | null): Promise<Meal | null> {
    const meals = await this.getAllMeals();
    return getRandomMeal(meals, excludeId);
  },

  async findMealsByIngredients(
    userIngredients: string[],
    filters?: FilterOptions
  ): Promise<IngredientMatch[]> {
    let meals = await this.getAllMeals();

    if (filters) {
      meals = filterMeals(meals, filters);
    }

    return filterMealsByIngredients(meals, userIngredients);
  },

  sortMatches(matches: IngredientMatch[], sortBy: SortOption): IngredientMatch[] {
    const sorted = [...matches];

    switch (sortBy) {
      case 'match':
        return sorted.sort((a, b) => b.matchPercentage - a.matchPercentage);

      case 'random':
        return sorted.sort(() => Math.random() - 0.5);

      case 'category':
        return sorted.sort((a, b) => a.meal.category.localeCompare(b.meal.category));

      case 'name':
        return sorted.sort((a, b) => a.meal.name.localeCompare(b.meal.name));

      default:
        return sorted;
    }
  }
};
