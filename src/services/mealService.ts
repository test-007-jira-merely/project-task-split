import { supabase } from '../lib/supabase';
import type { Meal } from '../types';

export const mealService = {
  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getMealsByCategory(category: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createMeal(mealData: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert([mealData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMeal(id: string, mealData: Partial<Meal>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .update(mealData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async importMeals(meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ count: number }> {
    const { data, error } = await supabase
      .from('meals')
      .insert(meals)
      .select();

    if (error) throw error;
    return { count: data?.length || 0 };
  },

  async searchMeals(query: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .or(`name.ilike.%${query}%,ingredients.cs.{${query}}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
