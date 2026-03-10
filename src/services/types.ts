/**
 * Type definitions for service interfaces
 */

import { User, Meal, Favorite, History } from '../types';

/**
 * Authentication service interface
 */
export interface AuthService {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  register(email: string, password: string): Promise<User>;
  getCurrentUser(): Promise<User | null>;
  verifyToken(token: string): Promise<boolean>;
}

/**
 * Meal service interface
 */
export interface MealService {
  getMeals(): Promise<Meal[]>;
  getMealById(id: string): Promise<Meal | null>;
  createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal>;
  updateMeal(id: string, meal: Partial<Meal>): Promise<Meal>;
  deleteMeal(id: string): Promise<void>;
  searchMeals(query: string): Promise<Meal[]>;
  getMealsByCategory(category: string): Promise<Meal[]>;
}

/**
 * Favorite service interface
 */
export interface FavoriteService {
  getFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(userId: string, mealId: string): Promise<Favorite>;
  removeFavorite(id: string): Promise<void>;
  isFavorite(userId: string, mealId: string): Promise<boolean>;
}

/**
 * History service interface
 */
export interface HistoryService {
  getHistory(userId: string): Promise<History[]>;
  addHistory(userId: string, mealId: string): Promise<History>;
  clearHistory(userId: string): Promise<void>;
  getHistoryByDateRange(userId: string, startDate: string, endDate: string): Promise<History[]>;
}
