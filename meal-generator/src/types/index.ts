export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  prepTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  is_admin?: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  meal_id: string;
  created_at: string;
}

export interface History {
  id: string;
  user_id: string;
  meal_id: string;
  generated_at: string;
}

export interface IngredientMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  ingredients: string[];
  filteredMeals: IngredientMatch[];
  favorites: Favorite[];
  history: History[];
  loading: boolean;
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setFilteredMeals: (meals: IngredientMatch[]) => void;
  setFavorites: (favorites: Favorite[]) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (favoriteId: string) => void;
  setHistory: (history: History[]) => void;
  addHistory: (historyItem: History) => void;
  setLoading: (loading: boolean) => void;
}

export interface FilterOptions {
  category?: MealCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  sortBy?: 'match' | 'random' | 'category';
}
