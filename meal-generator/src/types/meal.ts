export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: Difficulty;
  prepTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MealMatch extends Meal {
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface MealFilters {
  category?: MealCategory;
  difficulty?: Difficulty;
  maxPrepTime?: number;
  ingredients?: string[];
}

export type SortOption = 'match' | 'random' | 'category' | 'name';
