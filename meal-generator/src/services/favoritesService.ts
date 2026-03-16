import { supabase } from './supabase';
import type { Favorite } from '../types';

export const favoritesService = {
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, meals(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addFavorite(userId: string, mealId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, meal_id: mealId })
      .select()
      .single();

    if (error) throw error;
    return data as Favorite;
  },

  async removeFavorite(userId: string, mealId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  },

  async isFavorite(userId: string, mealId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_id', mealId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};
