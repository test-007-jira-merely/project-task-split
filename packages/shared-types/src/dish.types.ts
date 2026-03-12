export type DishCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  sodium?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit?: string;
  optional?: boolean;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  category: DishCategory;
  difficulty: DifficultyLevel;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  nutrition: NutritionInfo;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DishSummary {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: DishCategory;
  difficulty: DifficultyLevel;
  totalTime: number;
}
