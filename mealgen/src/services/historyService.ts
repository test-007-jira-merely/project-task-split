import { supabase } from './supabase';

export const historyService = {
  getHistory: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('user_history')
      .select('meal_id')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    // @ts-expect-error - Supabase type inference issue
    return data.map(h => h.meal_id);
  },

  addToHistory: async (userId: string, mealId: string) => {
    const { error } = await supabase
      .from('user_history')
      // @ts-expect-error - Supabase type inference issue
      .insert({ user_id: userId, meal_id: mealId });

    if (error) throw error;
  },
};
