import { supabase } from './supabase';
import { UserHistory } from '@/types';

export const historyService = {
  async getUserHistory(userId: string): Promise<UserHistory[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return data || [];
  },

  async addToHistory(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .insert([{ user_id: userId, meal_id: mealId }] as any);

    if (error) throw error;
  },
};
