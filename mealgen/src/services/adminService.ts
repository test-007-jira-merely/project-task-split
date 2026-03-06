import { supabase } from './supabase';
import type { Meal } from '@/types';

export const adminService = {
  async createMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        name: meal.name,
        image_url: meal.imageUrl,
        description: meal.description,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        preparation_time: meal.preparationTime,
        difficulty: meal.difficulty,
      } as any)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create meal');

    const result = data as any;
    return {
      id: result.id,
      name: result.name,
      imageUrl: result.image_url,
      description: result.description,
      ingredients: result.ingredients,
      instructions: result.instructions,
      category: result.category,
      preparationTime: result.preparation_time,
      difficulty: result.difficulty,
    };
  },

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    const updateData: any = {};
    if (meal.name) updateData.name = meal.name;
    if (meal.imageUrl) updateData.image_url = meal.imageUrl;
    if (meal.description) updateData.description = meal.description;
    if (meal.ingredients) updateData.ingredients = meal.ingredients;
    if (meal.instructions) updateData.instructions = meal.instructions;
    if (meal.category) updateData.category = meal.category;
    if (meal.preparationTime !== undefined)
      updateData.preparation_time = meal.preparationTime;
    if (meal.difficulty) updateData.difficulty = meal.difficulty;

    const { data, error } = await supabase
      .from('meals')
      // @ts-ignore - Supabase type mismatch
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update meal');

    const result = data as any;
    return {
      id: result.id,
      name: result.name,
      imageUrl: result.image_url,
      description: result.description,
      ingredients: result.ingredients,
      instructions: result.instructions,
      category: result.category,
      preparationTime: result.preparation_time,
      difficulty: result.difficulty,
    };
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase.from('meals').delete().eq('id', id);

    if (error) throw error;
  },

  async importMeals(meals: Omit<Meal, 'id'>[]): Promise<Meal[]> {
    const insertData = meals.map((meal) => ({
      name: meal.name,
      image_url: meal.imageUrl,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      preparation_time: meal.preparationTime,
      difficulty: meal.difficulty,
    }));

    const { data, error } = await supabase
      .from('meals')
      .insert(insertData as any)
      .select();

    if (error) throw error;
    if (!data) throw new Error('Failed to import meals');

    return (data as any[]).map((d: any) => ({
      id: d.id,
      name: d.name,
      imageUrl: d.image_url,
      description: d.description,
      ingredients: d.ingredients,
      instructions: d.instructions,
      category: d.category,
      preparationTime: d.preparation_time,
      difficulty: d.difficulty,
    }));
  },
};
