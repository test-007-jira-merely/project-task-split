export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  prepTime?: number;
  difficulty?: "easy" | "medium" | "hard";
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  meal_id: string;
  created_at: string;
}

export interface UserHistory {
  id: string;
  user_id: string;
  meal_id: string;
  generated_at: string;
}

export interface SupabaseMeal {
  id: string;
  name: string;
  description: string;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  prep_time?: number;
  difficulty?: string;
  created_at?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface Session {
  user: User;
  access_token: string;
}
