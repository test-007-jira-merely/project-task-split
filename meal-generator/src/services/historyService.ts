import { supabase } from './supabase';
import type { History } from '../types';

export const historyService = {
  async getUserHistory(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('user_history')
      .select('*, meals(*)')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async addToHistory(userId: string, mealId: string) {
    const { data, error } = await supabase
      .from('user_history')
      .insert({ user_id: userId, meal_id: mealId })
      .select()
      .single();

    if (error) throw error;
    return data as History;
  },
};
