// Zustand store type definitions and interfaces

import type { User, Meal, Favorite, UserHistory } from '../types';

export type Theme = 'light' | 'dark' | 'system';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export interface ThemeState {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

export interface MealState {
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  isGenerating: boolean;
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;
  setIsGenerating: (loading: boolean) => void;
}

export interface IngredientState {
  selectedIngredients: string[];
  filteredMeals: Meal[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setFilteredMeals: (meals: Meal[]) => void;
}

export interface FavoritesState {
  favorites: Favorite[];
  setFavorites: (favorites: Favorite[]) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (favoriteId: string) => void;
  isFavorite: (mealId: string) => boolean;
}

export interface HistoryState {
  history: UserHistory[];
  setHistory: (history: UserHistory[]) => void;
  addHistoryEntry: (entry: UserHistory) => void;
}

export interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: 'meal' | 'confirm' | null;
  toggleSidebar: () => void;
  openModal: (content: 'meal' | 'confirm') => void;
  closeModal: () => void;
}

export interface AppStore extends
  AuthState,
  ThemeState,
  MealState,
  IngredientState,
  FavoritesState,
  HistoryState,
  UIState {
  // Combined store interface
}
