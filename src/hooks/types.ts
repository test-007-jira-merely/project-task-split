/**
 * Type definitions for custom hooks return types
 */

import { User, Meal, MealMatch, Favorite } from '../types';

/**
 * useAuth hook return type
 */
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  error: string | null;
}

/**
 * useMeals hook return type
 */
export interface UseMealsReturn {
  meals: Meal[];
  filteredMeals: MealMatch[];
  selectedMeal: Meal | null;
  isLoading: boolean;
  error: string | null;
  fetchMeals: () => Promise<void>;
  selectMeal: (meal: Meal | null) => void;
  searchMeals: (ingredients: string[]) => MealMatch[];
  filterByCategory: (category: string) => void;
  filterByDifficulty: (difficulty: string) => void;
}

/**
 * useFavorites hook return type
 */
export interface UseFavoritesReturn {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (mealId: string) => Promise<void>;
  removeFavorite: (mealId: string) => Promise<void>;
  isFavorite: (mealId: string) => boolean;
  toggleFavorite: (mealId: string) => Promise<void>;
}
