/**
 * Core type definitions for the meal matching application
 */

// Meal category types
export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Meal difficulty levels
export type MealDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Meal interface representing a recipe/meal in the system
 */
export interface Meal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: MealDifficulty;
  prepTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User interface representing an authenticated user
 */
export interface User {
  id: string;
  email: string;
  isAdmin?: boolean;
  createdAt: string;
}

/**
 * Favorite interface representing a user's favorited meal
 */
export interface Favorite {
  id: string;
  userId: string;
  mealId: string;
  createdAt: string;
}

/**
 * History interface representing a user's meal generation history
 */
export interface History {
  id: string;
  userId: string;
  mealId: string;
  generatedAt: string;
}

/**
 * MealMatch interface representing a meal matched against user's ingredients
 */
export interface MealMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

/**
 * Database type representing the structure of all database tables
 */
export interface Database {
  meals: Meal[];
  favorites: Favorite[];
  user_history: History[];
}
