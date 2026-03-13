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

export interface UserHistory {
  id: string;
  user_id: string;
  meal_id: string;
  generated_at: string;
}

export interface MealWithMatch extends Meal {
  matchPercentage?: number;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  user: User | null;
  theme: Theme;
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  ingredients: string[];
  filteredMeals: MealWithMatch[];
  favorites: string[];
  history: UserHistory[];
  loading: boolean;
}
