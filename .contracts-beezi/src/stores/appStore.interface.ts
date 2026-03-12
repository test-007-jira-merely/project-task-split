// Interface for Zustand global state store

import { User, Meal, Theme } from '../types';

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export interface ThemeSlice {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

export interface MealSlice {
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;
}

export interface IngredientSlice {
  selectedIngredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setIngredients: (ingredients: string[]) => void;
}

export interface UISlice {
  isLoading: boolean;
  isSidebarOpen: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export type AppStore = AuthSlice & ThemeSlice & MealSlice & IngredientSlice & UISlice;
