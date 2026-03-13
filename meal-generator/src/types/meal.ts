export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  preparationTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt?: string;
  updatedAt?: string;
}

export interface MealMatch extends Meal {
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface MealFilter {
  category?: MealCategory;
  ingredients?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  sortBy?: 'match' | 'random' | 'category' | 'name';
}
