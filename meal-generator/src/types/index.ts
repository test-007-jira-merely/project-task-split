export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  mealId: string;
  meal?: Meal;
  createdAt: string;
}

export interface UserHistory {
  id: string;
  userId: string;
  mealId: string;
  meal?: Meal;
  generatedAt: string;
}

export interface IngredientMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface MealFilters {
  category?: MealCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxPrepTime?: number;
  ingredients?: string[];
}

export interface SortOption {
  value: 'match' | 'random' | 'category' | 'name';
  label: string;
}
