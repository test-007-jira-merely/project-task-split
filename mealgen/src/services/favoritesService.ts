import { supabase } from './supabase';

export const favoritesService = {
  getFavorites: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('meal_id')
      .eq('user_id', userId);

    if (error) throw error;
    // @ts-expect-error - Supabase type inference issue
    return data.map(f => f.meal_id);
  },

  addFavorite: async (userId: string, mealId: string) => {
    const { error } = await supabase
      .from('favorites')
      // @ts-expect-error - Supabase type inference issue
      .insert({ user_id: userId, meal_id: mealId });

    if (error) throw error;
  },

  removeFavorite: async (userId: string, mealId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  },
};
