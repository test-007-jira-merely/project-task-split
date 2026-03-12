import type { Meal, User } from './database';

export type Theme = 'light' | 'dark';

export interface MealFilter {
  category?: string;
  ingredients?: string[];
  difficulty?: string;
  sortBy?: 'match' | 'random' | 'category';
}

export interface IngredientMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface AppState {
  // User slice
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Theme slice
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  // Meal slice
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;

  // Ingredients slice
  selectedIngredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Filtered meals slice
  filteredMeals: IngredientMatch[];
  setFilteredMeals: (meals: IngredientMatch[]) => void;

  // Favorites slice
  favorites: string[]; // meal IDs
  addFavorite: (mealId: string) => void;
  removeFavorite: (mealId: string) => void;
  setFavorites: (mealIds: string[]) => void;
  isFavorite: (mealId: string) => boolean;

  // History slice
  history: string[]; // meal IDs
  addToHistory: (mealId: string) => void;
  setHistory: (mealIds: string[]) => void;

  // Loading slice
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
