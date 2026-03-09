// Interface for meal service operations

import { Meal, IngredientMatch, FilterOptions } from '../types';

export interface IMealService {
  /**
   * Get a random meal, optionally excluding a specific meal ID
   */
  getRandomMeal(excludeId?: string): Meal;

  /**
   * Find meals that match given ingredients
   */
  findMealsByIngredients(ingredients: string[]): IngredientMatch[];

  /**
   * Filter meals by various criteria
   */
  filterMeals(options: FilterOptions): Meal[];

  /**
   * Get all meals from local dataset
   */
  getAllMeals(): Meal[];

  /**
   * Get a specific meal by ID
   */
  getMealById(id: string): Meal | undefined;

  /**
   * Get meals by category
   */
  getMealsByCategory(category: string): Meal[];
}
