import { supabase } from './supabase';
import { Favorite } from '@/types';
import { IFavoritesService } from '@/types/services';

class FavoritesService implements IFavoritesService {
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addFavorite(userId: string, mealId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, meal_id: mealId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  }
}

export const favoritesService = new FavoritesService();
