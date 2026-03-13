import { supabase } from './supabase';
import type { Meal } from '@/types/meal';
import { normalizeMealData, toDbFormat } from '@/utils/normalization';

export const mealService = {
  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('name');

    if (error) throw error;
    return data ? data.map((item: any) => normalizeMealData(item)) : [];
  },

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? normalizeMealData(data as any) : null;
  },

  async createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert([toDbFormat(meal) as any])
      .select()
      .single();

    if (error) throw error;
    return normalizeMealData(data as any);
  },

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .update(toDbFormat(meal) as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return normalizeMealData(data as any);
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async importMeals(meals: Meal[]): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .insert(meals.map(m => toDbFormat(m)) as any);

    if (error) throw error;
  },

  async getFavorites(userId: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('meal_id, meals(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data ? data.map((item: any) => normalizeMealData(item.meals)) : [];
  },

  async addFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, meal_id: mealId } as any]);

    if (error) throw error;
  },

  async removeFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  },

  async getHistory(userId: string, limit: number = 20): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('meal_id, meals(*)')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ? data.map((item: any) => normalizeMealData(item.meals)) : [];
  },

  async addToHistory(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .insert([{ user_id: userId, meal_id: mealId } as any]);

    if (error) throw error;
  },
};
