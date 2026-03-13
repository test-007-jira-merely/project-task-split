export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'user' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'user' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'user' | 'admin';
          created_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          ingredients: string[];
          instructions: string[];
          category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          preparation_time: number | null;
          difficulty: 'easy' | 'medium' | 'hard' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          ingredients: string[];
          instructions: string[];
          category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          preparation_time?: number | null;
          difficulty?: 'easy' | 'medium' | 'hard' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          ingredients?: string[];
          instructions?: string[];
          category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          preparation_time?: number | null;
          difficulty?: 'easy' | 'medium' | 'hard' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          created_at?: string;
        };
      };
      user_history: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          generated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          generated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          generated_at?: string;
        };
      };
    };
  };
}
