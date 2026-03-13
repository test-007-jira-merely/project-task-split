import { supabase } from './supabase';

export const favoritesService = {
  async getUserFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('meal_id')
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map((fav: any) => fav.meal_id);
  },

  async addFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, meal_id: mealId }] as any);

    if (error) throw error;
  },

  async removeFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  },

  async isFavorite(userId: string, mealId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_id', mealId)
      .single();

    return !error && !!data;
  },
};
