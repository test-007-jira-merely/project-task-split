// Core type definitions for the MealGen application

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
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  mealId: string;
  createdAt: string;
  meal?: Meal;
}

export interface UserHistory {
  id: string;
  userId: string;
  mealId: string;
  generatedAt: string;
  meal?: Meal;
}

export interface IngredientMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface MealFilter {
  category?: MealCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxPreparationTime?: number;
  ingredients?: string[];
}

export type SortOption = 'match' | 'random' | 'category' | 'name';

export interface MealImportData {
  meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[];
}
