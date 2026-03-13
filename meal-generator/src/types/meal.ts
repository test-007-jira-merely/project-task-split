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

export interface MealFilter {
  category?: MealCategory;
  ingredients?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime?: number;
}

export interface MealMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}
