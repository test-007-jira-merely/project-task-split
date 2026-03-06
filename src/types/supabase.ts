export interface SupabaseMeal {
  id: string;
  name: string;
  description: string;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  prep_time?: number;
  difficulty?: string;
  created_at?: string;
}

export interface SupabaseFavorite {
  id: string;
  user_id: string;
  meal_id: string;
  created_at: string;
}

export interface SupabaseHistory {
  id: string;
  user_id: string;
  meal_id: string;
  generated_at: string;
}

export type Database = {
  public: {
    Tables: {
      meals: {
        Row: SupabaseMeal;
        Insert: Omit<SupabaseMeal, 'id' | 'created_at'>;
        Update: Partial<Omit<SupabaseMeal, 'id' | 'created_at'>>;
        Relationships: [];
      };
      favorites: {
        Row: SupabaseFavorite;
        Insert: Omit<SupabaseFavorite, 'id' | 'created_at'>;
        Update: Partial<Omit<SupabaseFavorite, 'id' | 'created_at'>>;
        Relationships: [];
      };
      user_history: {
        Row: SupabaseHistory;
        Insert: Omit<SupabaseHistory, 'id' | 'generated_at'>;
        Update: Partial<Omit<SupabaseHistory, 'id' | 'generated_at'>>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
