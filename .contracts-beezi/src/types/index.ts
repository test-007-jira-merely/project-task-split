// Core domain types for the meal discovery platform

export type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Theme = 'light' | 'dark' | 'system';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: Category;
  prepTime?: number; // in minutes
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

export interface IngredientMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface FilterOptions {
  category?: Category;
  ingredients?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime?: number;
  sortBy?: 'match' | 'random' | 'category';
}
