import { supabase } from './supabase';
import { IHistoryService } from './interfaces';
import { UserHistory } from '@/types';

class HistoryService implements IHistoryService {
  async getHistory(userId: string, limit: number = 50): Promise<UserHistory[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('*, meal:meals(*)')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(hist => ({
      id: hist.id,
      userId: hist.user_id,
      mealId: hist.meal_id,
      generatedAt: hist.generated_at,
      meal: hist.meal ? {
        id: hist.meal.id,
        name: hist.meal.name,
        description: hist.meal.description,
        imageUrl: hist.meal.image_url,
        ingredients: hist.meal.ingredients,
        instructions: hist.meal.instructions,
        category: hist.meal.category,
        preparationTime: hist.meal.preparation_time,
        difficulty: hist.meal.difficulty,
        createdAt: hist.meal.created_at,
        updatedAt: hist.meal.updated_at,
      } : undefined,
    }));
  }

  async addHistoryEntry(userId: string, mealId: string): Promise<UserHistory> {
    const { data, error } = await supabase
      .from('user_history')
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
      generatedAt: data.generated_at,
    };
  }

  async clearHistory(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
}

export const historyService = new HistoryService();
