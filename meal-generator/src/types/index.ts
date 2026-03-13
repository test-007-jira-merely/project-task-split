export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type CookingDifficulty = 'easy' | 'medium' | 'hard';
export type UserRole = 'user' | 'admin';
export type Theme = 'light' | 'dark';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: CookingDifficulty;
  prepTime?: number; // in minutes
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  mealId: string;
  createdAt: string;
  meal?: Meal;
}

export interface UserHistory {
  id: string;
  userId: string;
  mealId: string;
  generatedAt: string;
  meal?: Meal;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'createdAt'>;
        Update: Partial<Omit<User, 'id'>>;
      };
      meals: {
        Row: Meal;
        Insert: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Meal, 'id'>>;
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'createdAt'>;
        Update: Partial<Omit<Favorite, 'id'>>;
      };
      user_history: {
        Row: UserHistory;
        Insert: Omit<UserHistory, 'id'>;
        Update: Partial<Omit<UserHistory, 'id'>>;
      };
    };
  };
}

export interface MatchResult {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface FilterOptions {
  category?: MealCategory;
  difficulty?: CookingDifficulty;
  maxPrepTime?: number;
  sortBy?: 'match' | 'random' | 'category';
}
