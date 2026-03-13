import { supabase } from './supabase';
import type { UserHistory } from '@/types';

export const historyService = {
  async getUserHistory(userId: string, limit: number = 50): Promise<UserHistory[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select(`
        *,
        meal:meals(*)
      `)
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((history: any) => ({
      id: history.id,
      userId: history.user_id,
      mealId: history.meal_id,
      generatedAt: history.generated_at,
      meal: history.meal ? {
        id: history.meal.id,
        name: history.meal.name,
        imageUrl: history.meal.image_url,
        description: history.meal.description,
        ingredients: history.meal.ingredients,
        instructions: history.meal.instructions,
        category: history.meal.category,
        difficulty: history.meal.difficulty,
        prepTime: history.meal.prep_time,
      } : undefined,
    }));
  },

  async addToHistory(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .insert({
        user_id: userId,
        meal_id: mealId,
        generated_at: new Date().toISOString(),
      } as any);

    if (error) throw error;
  },

  async clearHistory(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },
};
