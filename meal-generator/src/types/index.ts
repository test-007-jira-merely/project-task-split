export type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: Category;
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime?: number;
  created_at?: string;
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

export interface History {
  id: string;
  user_id: string;
  meal_id: string;
  generated_at: string;
}

export interface Database {
  public: {
    Tables: {
      meals: {
        Row: Meal;
        Insert: Omit<Meal, 'id' | 'created_at'>;
        Update: Partial<Omit<Meal, 'id'>>;
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'>;
        Update: never;
      };
      user_history: {
        Row: History;
        Insert: Omit<History, 'id' | 'generated_at'>;
        Update: never;
      };
    };
  };
}
