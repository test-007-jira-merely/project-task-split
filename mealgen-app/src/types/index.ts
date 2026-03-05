// Core domain types for the meal discovery platform

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Theme = 'light' | 'dark';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  preparationTime?: number; // in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  is_admin?: boolean;
}

export interface Favorite {
  id: string;
  user_id: string;
  meal_id: string;
  created_at: string;
}

export interface UserHistory {
  id: string;
  user_id: string;
  meal_id: string;
  generated_at: string;
}

export interface MealWithMatch extends Meal {
  matchPercentage?: number;
  matchedIngredients?: string[];
  missingIngredients?: string[];
}

export interface IngredientMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

// Filter and sort options
export interface MealFilters {
  category?: MealCategory;
  ingredients?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  minMatchPercentage?: number;
}

export type SortOption = 'match' | 'random' | 'category' | 'name';

// State management types
export interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;

  // Theme
  theme: Theme;

  // Meals
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  meals: Meal[];
  filteredMeals: MealWithMatch[];

  // Ingredients
  selectedIngredients: string[];

  // Favorites
  favorites: Favorite[];

  // History
  history: UserHistory[];

  // Loading states
  isLoadingMeals: boolean;
  isLoadingFavorites: boolean;
  isLoadingHistory: boolean;
}

// Actions interface for Zustand store
export interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  logout: () => void;

  // Theme actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Meal actions
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;
  loadMeals: (meals: Meal[]) => void;
  setFilteredMeals: (meals: MealWithMatch[]) => void;

  // Ingredient actions
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Favorites actions
  setFavorites: (favorites: Favorite[]) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (favoriteId: string) => void;

  // History actions
  setHistory: (history: UserHistory[]) => void;
  addHistoryEntry: (entry: UserHistory) => void;

  // Loading actions
  setLoadingMeals: (loading: boolean) => void;
  setLoadingFavorites: (loading: boolean) => void;
  setLoadingHistory: (loading: boolean) => void;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface MealFormData {
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  preparationTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// API response types
export interface AuthResponse {
  user: User;
  session: any;
}

export interface MealResponse {
  meals: Meal[];
  count: number;
}
