export interface Meal {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  prepTime?: number;
  servings?: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MealInput {
  name: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  prepTime?: number;
  servings?: number;
  userId?: string;
}

export interface MealDbRecord {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  image_url?: string;
  prep_time?: number;
  servings?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
