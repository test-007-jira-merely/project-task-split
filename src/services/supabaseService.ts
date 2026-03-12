import { supabase } from './supabase';
import type { Database } from '@/types/database.types';

export const supabaseService = {
  // Auth
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { user: data.user, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return userData ? {
      id: (userData as any).id,
      email: (userData as any).email,
      isAdmin: (userData as any).is_admin,
      createdAt: (userData as any).created_at
    } : null;
  },

  // Favorites
  addFavorite: async (userId: string, mealId: string) => {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, meal_id: mealId } as any);
    if (error) throw error;
  },

  removeFavorite: async (userId: string, mealId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: userId, meal_id: mealId });
    if (error) throw error;
  },

  getFavorites: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('meal_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map((f: any) => f.meal_id) || [];
  },

  // History
  addToHistory: async (userId: string, mealId: string) => {
    const { error } = await supabase
      .from('user_history')
      .insert({ user_id: userId, meal_id: mealId } as any);
    if (error) throw error;
  },

  getHistory: async (userId: string, limit: number = 20) => {
    const { data, error } = await supabase
      .from('user_history')
      .select('meal_id, generated_at')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Admin - Meals
  createMeal: async (meal: Database['public']['Tables']['meals']['Insert']) => {
    const { error } = await supabase.from('meals').insert(meal as any);
    if (error) throw error;
  },

  updateMeal: async (id: string, meal: Database['public']['Tables']['meals']['Update']) => {
    const { error } = await (supabase.from('meals') as any).update(meal).eq('id', id);
    if (error) throw error;
  },

  deleteMeal: async (id: string) => {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) throw error;
  },

  getAllMeals: async () => {
    const { data, error } = await supabase.from('meals').select('*');
    if (error) throw error;
    return data || [];
  }
};
