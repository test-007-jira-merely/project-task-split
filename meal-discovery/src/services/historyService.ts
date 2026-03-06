import { supabase } from './supabase';
import { UserHistory } from '@/types';
import { IHistoryService } from '@/types/services';

class HistoryService implements IHistoryService {
  async getUserHistory(userId: string): Promise<UserHistory[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  async addToHistory(userId: string, mealId: string): Promise<UserHistory> {
    const { data, error } = await supabase
      .from('user_history')
      .insert([{ user_id: userId, meal_id: mealId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const historyService = new HistoryService();
