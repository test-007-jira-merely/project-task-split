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

export interface MealWithMatch extends Meal {
  matchPercentage: number;
}

export interface MealFilters {
  category?: MealCategory;
  difficulty?: MealDifficulty;
  maxPrepTime?: number;
  ingredients?: string[];
}

export type SortOption = 'match' | 'random' | 'category' | 'name';
