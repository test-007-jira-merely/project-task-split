import { supabase } from './supabase';
import type { Meal } from '../types';

export const mealService = {
  async getAllMeals() {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Meal[];
  },

  async getMealById(id: string) {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Meal;
  },

  async createMeal(meal: Omit<Meal, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();

    if (error) throw error;
    return data as Meal;
  },

  async updateMeal(id: string, meal: Partial<Omit<Meal, 'id'>>) {
    const { data, error } = await supabase
      .from('meals')
      .update(meal)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Meal;
  },

  async deleteMeal(id: string) {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) throw error;
  },

  async getMealsByCategory(category: string) {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Meal[];
  },
};
