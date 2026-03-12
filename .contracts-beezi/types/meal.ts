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

export interface MealWithMatch extends Meal {
  matchPercentage: number;
}

export interface MealFilter {
  category?: MealCategory;
  ingredients?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime?: number;
}

export interface MealSortOption {
  type: 'match' | 'random' | 'category';
  direction?: 'asc' | 'desc';
}
