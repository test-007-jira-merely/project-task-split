import { Meal, MealFilter, SortOption } from '../types/meal';
import { User } from '../types/user';

export type Theme = 'light' | 'dark';

export interface AppState {
  // User
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

  // Filters & Sorting
  filters: MealFilter;
  setFilters: (filters: MealFilter) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;

  // Favorites
  favorites: string[];
  addFavorite: (mealId: string) => void;
  removeFavorite: (mealId: string) => void;
  setFavorites: (favorites: string[]) => void;

  // History
  history: string[];
  addToHistory: (mealId: string) => void;
  setHistory: (history: string[]) => void;

  // Loading
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
