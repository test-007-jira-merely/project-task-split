import { supabase } from './supabase';
import type { Meal } from '@/types';

export const adminService = {
  createMeal: async (meal: Omit<Meal, 'id'>) => {
    const { data, error } = await supabase
      .from('meals')
      // @ts-expect-error - Supabase type inference issue
      .insert({
        name: meal.name,
        description: meal.description,
        image_url: meal.imageUrl,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        preparation_time: meal.preparationTime || null,
        difficulty: meal.difficulty || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateMeal: async (id: string, meal: Partial<Meal>) => {
    const updateData: Record<string, unknown> = {};
    if (meal.name) updateData.name = meal.name;
    if (meal.description) updateData.description = meal.description;
    if (meal.imageUrl) updateData.image_url = meal.imageUrl;
    if (meal.ingredients) updateData.ingredients = meal.ingredients;
    if (meal.instructions) updateData.instructions = meal.instructions;
    if (meal.category) updateData.category = meal.category;
    if (meal.preparationTime !== undefined) updateData.preparation_time = meal.preparationTime;
    if (meal.difficulty !== undefined) updateData.difficulty = meal.difficulty;

    const { error} = await supabase
      .from('meals')
      // @ts-expect-error - Supabase type inference issue
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  },

  deleteMeal: async (id: string) => {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  importMeals: async (meals: Omit<Meal, 'id'>[]) => {
    const insertData = meals.map(meal => ({
      name: meal.name,
      description: meal.description,
      image_url: meal.imageUrl,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      preparation_time: meal.preparationTime || null,
      difficulty: meal.difficulty || null,
    }));

    const { error } = await supabase
      .from('meals')
      // @ts-expect-error - Supabase type inference issue
      .insert(insertData);

    if (error) throw error;
  },
};
