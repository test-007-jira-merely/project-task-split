import type { Meal, MealCategory } from '../types/database';
import type { IngredientMatch } from '../types/store';

export interface IMealService {
  // CRUD operations
  getAllMeals(): Promise<Meal[]>;
  getMealById(id: string): Promise<Meal | null>;
  createMeal(meal: Omit<Meal, 'id'>): Promise<Meal>;
  updateMeal(id: string, meal: Partial<Meal>): Promise<Meal>;
  deleteMeal(id: string): Promise<void>;

  // Bulk operations
  importMeals(meals: Omit<Meal, 'id'>[]): Promise<Meal[]>;

  // Random generation
  getRandomMeal(excludeId?: string): Promise<Meal | null>;

  // Filtering and matching
  filterMealsByCategory(category: MealCategory): Promise<Meal[]>;
  findMealsByIngredients(ingredients: string[]): Promise<IngredientMatch[]>;

  // Ingredient matching utilities
  calculateIngredientMatch(mealIngredients: string[], userIngredients: string[]): {
    matchPercentage: number;
    matchedIngredients: string[];
    missingIngredients: string[];
  };

  normalizeIngredient(ingredient: string): string;
}

export interface IFavoriteService {
  getUserFavorites(userId: string): Promise<string[]>;
  addFavorite(userId: string, mealId: string): Promise<void>;
  removeFavorite(userId: string, mealId: string): Promise<void>;
  isFavorite(userId: string, mealId: string): Promise<boolean>;
}

export interface IHistoryService {
  getUserHistory(userId: string): Promise<string[]>;
  addToHistory(userId: string, mealId: string): Promise<void>;
  clearHistory(userId: string): Promise<void>;
}
