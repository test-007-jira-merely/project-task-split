// Zustand store interface - defines global state shape and actions

import type { Meal, User, Theme, IngredientMatch } from '../types';

export interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme state
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Meal generation state
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  setCurrentMeal: (meal: Meal | null) => void;
  generateRandomMeal: (meals: Meal[]) => void;

  // Ingredient filtering state
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Filtered meals state
  filteredMeals: IngredientMatch[];
  setFilteredMeals: (meals: IngredientMatch[]) => void;

  // Favorites state
  favorites: string[]; // meal IDs
  setFavorites: (favorites: string[]) => void;
  addFavorite: (mealId: string) => void;
  removeFavorite: (mealId: string) => void;
  isFavorite: (mealId: string) => boolean;

  // History state
  history: string[]; // meal IDs
  setHistory: (history: string[]) => void;
  addToHistory: (mealId: string) => void;

  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
