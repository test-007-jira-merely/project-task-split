export type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: Category;
  preparationTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
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

export interface MealWithMatch extends Meal {
  matchPercentage?: number;
}
