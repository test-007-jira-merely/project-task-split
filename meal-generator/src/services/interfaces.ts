// Service layer interfaces for data operations

import type { Meal, Favorite, UserHistory, MealFilter, IngredientMatch } from '../types';

export interface IMealService {
  getAllMeals(): Promise<Meal[]>;
  getMealById(id: string): Promise<Meal | null>;
  getRandomMeal(excludeId?: string): Promise<Meal | null>;
  createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal>;
  updateMeal(id: string, meal: Partial<Meal>): Promise<Meal>;
  deleteMeal(id: string): Promise<void>;
  importMeals(meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ imported: number; skipped: number }>;
  filterMeals(filter: MealFilter): Promise<Meal[]>;
  searchMealsByIngredients(ingredients: string[]): Promise<IngredientMatch[]>;
}

export interface IFavoritesService {
  getFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(userId: string, mealId: string): Promise<Favorite>;
  removeFavorite(favoriteId: string): Promise<void>;
  isFavorite(userId: string, mealId: string): Promise<boolean>;
}

export interface IHistoryService {
  getHistory(userId: string, limit?: number): Promise<UserHistory[]>;
  addHistoryEntry(userId: string, mealId: string): Promise<UserHistory>;
  clearHistory(userId: string): Promise<void>;
}

export interface IAuthService {
  signUp(email: string, password: string): Promise<{ user: any; session: any }>;
  signIn(email: string, password: string): Promise<{ user: any; session: any }>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<any>;
  getSession(): Promise<any>;
}

export interface IIngredientMatcher {
  normalizeIngredient(ingredient: string): string;
  calculateMatch(mealIngredients: string[], selectedIngredients: string[]): {
    percentage: number;
    matched: string[];
    missing: string[];
  };
  filterByIngredients(meals: Meal[], ingredients: string[]): IngredientMatch[];
  getSuggestions(meals: Meal[], prefix: string): string[];
}
