export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type MealDifficulty = 'easy' | 'medium' | 'hard';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: MealDifficulty;
  prepTime?: number; // in minutes
}

export interface MealMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface MealFilter {
  category?: MealCategory;
  difficulty?: MealDifficulty;
  maxPrepTime?: number;
  availableIngredients?: string[];
}

export type MealSortOption = 'best-match' | 'random' | 'category' | 'prep-time';
