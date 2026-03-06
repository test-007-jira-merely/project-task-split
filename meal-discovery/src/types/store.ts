import { Meal, User } from './index';

export interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Meal generator state
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;

  // Ingredient filter state
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Filtered meals state
  filteredMeals: Meal[];
  setFilteredMeals: (meals: Meal[]) => void;

  // Favorites state
  favorites: string[]; // meal IDs
  addFavorite: (mealId: string) => void;
  removeFavorite: (mealId: string) => void;
  setFavorites: (favorites: string[]) => void;

  // History state
  history: string[]; // meal IDs
  addToHistory: (mealId: string) => void;
  setHistory: (history: string[]) => void;

  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
