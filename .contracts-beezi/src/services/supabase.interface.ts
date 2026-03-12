// Interface for Supabase service operations

import { User, Favorite, UserHistory } from '../types';

export interface SupabaseAuthResult {
  user: User | null;
  error: Error | null;
}

export interface ISupabaseService {
  // Authentication
  signUp(email: string, password: string): Promise<SupabaseAuthResult>;
  signIn(email: string, password: string): Promise<SupabaseAuthResult>;
  signOut(): Promise<{ error: Error | null }>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;

  // Favorites
  getFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(userId: string, mealId: string): Promise<{ error: Error | null }>;
  removeFavorite(userId: string, mealId: string): Promise<{ error: Error | null }>;
  isFavorite(userId: string, mealId: string): Promise<boolean>;

  // History
  getHistory(userId: string, limit?: number): Promise<UserHistory[]>;
  addToHistory(userId: string, mealId: string): Promise<{ error: Error | null }>;

  // Admin - Meals CRUD
  createMeal(meal: Omit<any, 'id'>): Promise<{ data: any | null; error: Error | null }>;
  updateMeal(id: string, meal: Partial<any>): Promise<{ error: Error | null }>;
  deleteMeal(id: string): Promise<{ error: Error | null }>;
  importMeals(meals: any[]): Promise<{ error: Error | null }>;
  getAllMealsFromDB(): Promise<any[]>;
}
