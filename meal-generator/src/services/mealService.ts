import { supabase } from './supabase';
import type { Meal, MealCategory } from '@/types';

export const mealService = {
  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((meal: any) => ({
      id: meal.id,
      name: meal.name,
      imageUrl: meal.image_url,
      description: meal.description,
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
      category: meal.category as MealCategory,
      difficulty: meal.difficulty as any,
      prepTime: meal.prep_time || undefined,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at,
    }));
  },

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    const meal: any = data;
    return {
      id: meal.id,
      name: meal.name,
      imageUrl: meal.image_url,
      description: meal.description,
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
      category: meal.category as MealCategory,
      difficulty: meal.difficulty as any,
      prepTime: meal.prep_time || undefined,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at,
    };
  },

  async createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        name: meal.name,
        image_url: meal.imageUrl,
        description: meal.description,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        difficulty: meal.difficulty,
        prep_time: meal.prepTime,
      } as any)
      .select()
      .single();

    if (error) throw error;

    const result: any = data;
    return {
      id: result.id,
      name: result.name,
      imageUrl: result.image_url,
      description: result.description,
      ingredients: result.ingredients,
      instructions: result.instructions,
      category: result.category as MealCategory,
      difficulty: result.difficulty as any,
      prepTime: result.prep_time || undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async updateMeal(id: string, updates: Partial<Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Meal> {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.imageUrl) updateData.image_url = updates.imageUrl;
    if (updates.description) updateData.description = updates.description;
    if (updates.ingredients) updateData.ingredients = updates.ingredients;
    if (updates.instructions) updateData.instructions = updates.instructions;
    if (updates.category) updateData.category = updates.category;
    if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
    if (updates.prepTime !== undefined) updateData.prep_time = updates.prepTime;

    const { data, error } = await (supabase as any)
      .from('meals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const result: any = data;
    return {
      id: result.id,
      name: result.name,
      imageUrl: result.image_url,
      description: result.description,
      ingredients: result.ingredients,
      instructions: result.instructions,
      category: result.category as MealCategory,
      difficulty: result.difficulty as any,
      prepTime: result.prep_time || undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async importMeals(meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    const insertData = meals.map(meal => ({
      name: meal.name,
      image_url: meal.imageUrl,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      difficulty: meal.difficulty,
      prep_time: meal.prepTime,
    }));

    const { error } = await supabase
      .from('meals')
      .insert(insertData as any);

    if (error) throw error;
  },
};
