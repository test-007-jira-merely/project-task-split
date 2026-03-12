// Supabase client configuration and type-safe helpers

import { createClient } from '@supabase/supabase-js';

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          is_admin: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          is_admin?: boolean;
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

// Initialize Supabase client
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Type-safe helper functions
export const supabaseHelpers = {
  // Auth helpers
  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  },

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    return await supabase.auth.getSession();
  },

  // User helpers
  async getUserProfile(userId: string) {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  },

  // Meal helpers
  async getMeals() {
    return await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async getMealById(id: string) {
    return await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();
  },

  async createMeal(meal: Database['public']['Tables']['meals']['Insert']) {
    return await (supabase
      .from('meals')
      .insert(meal as any) as any)
      .select()
      .single();
  },

  async updateMeal(id: string, meal: Database['public']['Tables']['meals']['Update']) {
    return await (supabase.from('meals') as any)
      .update(meal)
      .eq('id', id)
      .select()
      .single();
  },

  async deleteMeal(id: string) {
    return await supabase
      .from('meals')
      .delete()
      .eq('id', id);
  },

  // Favorites helpers
  async getFavorites(userId: string) {
    return await supabase
      .from('favorites')
      .select('*, meals(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async addFavorite(userId: string, mealId: string) {
    return await (supabase
      .from('favorites')
      .insert({ user_id: userId, meal_id: mealId } as any) as any)
      .select()
      .single();
  },

  async removeFavorite(id: string) {
    return await supabase
      .from('favorites')
      .delete()
      .eq('id', id);
  },

  async checkIsFavorite(userId: string, mealId: string) {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_id', mealId)
      .single();
    return !!data;
  },

  // History helpers
  async getHistory(userId: string, limit = 50) {
    return await supabase
      .from('user_history')
      .select('*, meals(*)')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(limit);
  },

  async addHistoryEntry(userId: string, mealId: string) {
    return await (supabase
      .from('user_history')
      .insert({ user_id: userId, meal_id: mealId } as any) as any)
      .select()
      .single();
  },
};
