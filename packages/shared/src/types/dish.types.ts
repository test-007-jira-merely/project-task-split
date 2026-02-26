/**
 * Shared type definitions for Dish domain
 * Used across frontend, backend, and database layers
 */

export type DishCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category?: string;
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
  prepTime: number; // minutes
  cookTime: number; // minutes
  nutrition: NutritionInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDishDto {
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Omit<Ingredient, 'id'>[];
  instructions: string[];
  category: DishCategory;
  difficulty: DifficultyLevel;
  prepTime: number;
  cookTime: number;
  nutrition: NutritionInfo;
}

export interface UpdateDishDto extends Partial<CreateDishDto> {
  id: string;
}
