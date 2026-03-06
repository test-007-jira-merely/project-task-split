// Core type definitions shared across the application

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

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

export interface IngredientMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export type Theme = 'light' | 'dark';

export interface FilterOptions {
  category?: MealCategory;
  ingredients?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  preparationTime?: number;
}

export type SortOption = 'match' | 'random' | 'category' | 'name';
