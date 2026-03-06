import { supabase } from './supabase';
import type { Favorite } from '@/types';

export const favoritesService = {
  async getFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('meal_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as any)?.map((fav: any) => fav.meal_id) || [];
  },

  async addFavorite(userId: string, mealId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        meal_id: mealId,
      } as any)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to add favorite');

    return data as any;
  },

  async removeFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  },
};
