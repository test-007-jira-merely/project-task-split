import { supabase } from './supabase';
import type { Favorite } from '@/types';

export const favoritesService = {
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        meal:meals(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((fav: any) => ({
      id: fav.id,
      userId: fav.user_id,
      mealId: fav.meal_id,
      createdAt: fav.created_at,
      meal: fav.meal ? {
        id: fav.meal.id,
        name: fav.meal.name,
        imageUrl: fav.meal.image_url,
        description: fav.meal.description,
        ingredients: fav.meal.ingredients,
        instructions: fav.meal.instructions,
        category: fav.meal.category,
        difficulty: fav.meal.difficulty,
        prepTime: fav.meal.prep_time,
      } : undefined,
    }));
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

    return {
      id: (data as any).id,
      userId: (data as any).user_id,
      mealId: (data as any).meal_id,
      createdAt: (data as any).created_at,
    };
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
