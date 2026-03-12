import { Meal } from './meal';
import { User } from './user';

export type Theme = 'light' | 'dark';

export interface AppState {
  // User & Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Current Meal
  currentMeal: Meal | null;
  setCurrentMeal: (meal: Meal | null) => void;
  lastGeneratedMealId: string | null;

  // Ingredients
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Filtered Meals
  filteredMeals: Meal[];
  setFilteredMeals: (meals: Meal[]) => void;

  // Favorites (cached from Supabase)
  favorites: string[];
  setFavorites: (favoriteIds: string[]) => void;
  addFavorite: (mealId: string) => void;
  removeFavorite: (mealId: string) => void;

  // History (cached from Supabase)
  history: string[];
  setHistory: (mealIds: string[]) => void;
  addToHistory: (mealId: string) => void;

  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
