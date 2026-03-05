// Core type definitions for the meal discovery application

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: Difficulty;
  prepTime?: number; // in minutes
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

export interface SupabaseMeal {
  id: string;
  name: string;
  description: string;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: Difficulty;
  prep_time?: number;
  created_at?: string;
}

export interface MealWithMatch extends Meal {
  matchPercentage?: number;
}

export interface IngredientMatch {
  matched: string[];
  missing: string[];
  percentage: number;
}

export interface FilterOptions {
  category?: MealCategory;
  difficulty?: Difficulty;
  maxPrepTime?: number;
  sortBy?: 'match' | 'random' | 'category' | 'name';
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}

export interface Theme {
  mode: 'light' | 'dark';
}

export interface AppState {
  // Auth
  user: User | null;
  session: any | null;

  // Theme
  theme: 'light' | 'dark';

  // Meals
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;

  // Ingredients
  selectedIngredients: string[];
  filteredMeals: MealWithMatch[];

  // Favorites
  favorites: Favorite[];

  // History
  history: UserHistory[];

  // Loading states
  loading: {
    meals: boolean;
    favorites: boolean;
    history: boolean;
    auth: boolean;
  };

  // Filters
  filters: FilterOptions;
}

export interface MealFormData {
  name: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: Difficulty;
  prepTime?: number;
}
