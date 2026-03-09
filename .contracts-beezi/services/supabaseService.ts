import { User, Favorite, UserHistory } from '../types/user';
import { Meal } from '../types/meal';

export interface ISupabaseAuthService {
  /**
   * Sign up a new user
   */
  signUp(email: string, password: string): Promise<User>;

  /**
   * Sign in an existing user
   */
  signIn(email: string, password: string): Promise<User>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}

export interface ISupabaseFavoritesService {
  /**
   * Get all favorites for a user
   */
  getFavorites(userId: string): Promise<Favorite[]>;

  /**
   * Add a meal to favorites
   */
  addFavorite(userId: string, mealId: string): Promise<Favorite>;

  /**
   * Remove a meal from favorites
   */
  removeFavorite(userId: string, mealId: string): Promise<void>;

  /**
   * Check if a meal is favorited
   */
  isFavorite(userId: string, mealId: string): Promise<boolean>;
}

export interface ISupabaseHistoryService {
  /**
   * Get user's meal history
   */
  getHistory(userId: string, limit?: number): Promise<UserHistory[]>;

  /**
   * Add a meal to history
   */
  addToHistory(userId: string, mealId: string): Promise<UserHistory>;
}

export interface ISupabaseMealService {
  /**
   * Get all meals from Supabase
   */
  getMeals(): Promise<Meal[]>;

  /**
   * Create a new meal in Supabase
   */
  createMeal(meal: Omit<Meal, 'id'>): Promise<Meal>;

  /**
   * Update an existing meal
   */
  updateMeal(id: string, meal: Partial<Meal>): Promise<Meal>;

  /**
   * Delete a meal
   */
  deleteMeal(id: string): Promise<void>;

  /**
   * Bulk import meals from JSON
   */
  bulkImportMeals(meals: Meal[]): Promise<Meal[]>;
}
