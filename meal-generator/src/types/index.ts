export type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: Category;
  difficulty?: Difficulty;
  prepTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  mealId: string;
  createdAt: string;
}

export interface UserHistory {
  id: string;
  userId: string;
  mealId: string;
  generatedAt: string;
}

export interface IngredientMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface FilterOptions {
  category?: Category;
  difficulty?: Difficulty;
  maxPrepTime?: number;
  ingredients?: string[];
}

export type SortOption = 'match' | 'random' | 'category' | 'name';

export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  ingredients: string[];
  filteredMeals: IngredientMatch[];
  favorites: string[];
  history: UserHistory[];
  loading: boolean;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setFilteredMeals: (meals: IngredientMatch[]) => void;
  setFavorites: (favorites: string[]) => void;
  addFavorite: (mealId: string) => void;
  removeFavorite: (mealId: string) => void;
  setHistory: (history: UserHistory[]) => void;
  addToHistory: (entry: UserHistory) => void;
  setLoading: (loading: boolean) => void;
}

export interface MealFormData {
  name: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  category: Category;
  difficulty?: Difficulty;
  prepTime?: number;
}

export interface AuthFormData {
  email: string;
  password: string;
}
