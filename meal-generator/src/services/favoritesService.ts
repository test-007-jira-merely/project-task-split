import { supabase } from './supabase';
import { IFavoritesService } from './interfaces';
import { Favorite } from '@/types';

class FavoritesService implements IFavoritesService {
  async getFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, meal:meals(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(fav => ({
      id: fav.id,
      userId: fav.user_id,
      mealId: fav.meal_id,
      createdAt: fav.created_at,
      meal: fav.meal ? {
        id: fav.meal.id,
        name: fav.meal.name,
        description: fav.meal.description,
        imageUrl: fav.meal.image_url,
        ingredients: fav.meal.ingredients,
        instructions: fav.meal.instructions,
        category: fav.meal.category,
        preparationTime: fav.meal.preparation_time,
        difficulty: fav.meal.difficulty,
        createdAt: fav.meal.created_at,
        updatedAt: fav.meal.updated_at,
      } : undefined,
    }));
  }

  async addFavorite(userId: string, mealId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        meal_id: mealId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      mealId: data.meal_id,
      createdAt: data.created_at,
    };
  }

  async removeFavorite(favoriteId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);

    if (error) throw error;
  }

  async isFavorite(userId: string, mealId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_id', mealId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
}

export const favoritesService = new FavoritesService();
