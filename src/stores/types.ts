/**
 * Type definitions for Zustand store slices
 */

import { User, Meal, MealMatch, Favorite, History, MealCategory, MealDifficulty } from '../types';

/**
 * User authentication state slice
 */
export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

/**
 * Theme state slice
 */
export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * Meal state slice
 */
export interface MealState {
  meals: Meal[];
  selectedMeal: Meal | null;
  setMeals: (meals: Meal[]) => void;
  setSelectedMeal: (meal: Meal | null) => void;
  addMeal: (meal: Meal) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
}

/**
 * Ingredient state slice
 */
export interface IngredientState {
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setIngredients: (ingredients: string[]) => void;
}

/**
 * Filtered meals state slice
 */
export interface FilteredMealsState {
  filteredMeals: MealMatch[];
  categoryFilter: MealCategory | 'all';
  difficultyFilter: MealDifficulty | 'all';
  minMatchPercentage: number;
  setFilteredMeals: (meals: MealMatch[]) => void;
  setCategoryFilter: (category: MealCategory | 'all') => void;
  setDifficultyFilter: (difficulty: MealDifficulty | 'all') => void;
  setMinMatchPercentage: (percentage: number) => void;
  clearFilters: () => void;
}

/**
 * Favorites state slice
 */
export interface FavoritesState {
  favorites: Favorite[];
  setFavorites: (favorites: Favorite[]) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (mealId: string) => boolean;
}

/**
 * History state slice
 */
export interface HistoryState {
  history: History[];
  setHistory: (history: History[]) => void;
  addHistory: (history: History) => void;
  clearHistory: () => void;
}

/**
 * Loading state slice
 */
export interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
  setLoading: (isLoading: boolean, message?: string) => void;
  clearLoading: () => void;
}

/**
 * Combined app store type
 */
export type AppStore = UserState &
  ThemeState &
  MealState &
  IngredientState &
  FilteredMealsState &
  FavoritesState &
  HistoryState &
  LoadingState;
