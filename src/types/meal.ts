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
}

export interface MealMatch {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface MealFilter {
  category?: MealCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxPrepTime?: number;
  minMatchPercentage?: number;
}

export type SortOption = 'match' | 'random' | 'category' | 'name';
