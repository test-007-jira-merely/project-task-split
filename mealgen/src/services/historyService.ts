import { supabase } from './supabase';
import type { UserHistory } from '@/types';

export const historyService = {
  async getHistory(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('meal_id')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return (data as any)?.map((history: any) => history.meal_id) || [];
  },

  async addToHistory(userId: string, mealId: string): Promise<UserHistory> {
    const { data, error } = await supabase
      .from('user_history')
      .insert({
        user_id: userId,
        meal_id: mealId,
      } as any)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to add to history');

    return data as any;
  },
};
