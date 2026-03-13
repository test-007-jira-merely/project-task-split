import { supabase } from './supabase';
import { Meal } from '@/types';

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
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category as any,
      prepTime: meal.prep_time || undefined,
      difficulty: meal.difficulty as any,
      created_at: meal.created_at,
    }));
  },

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;

    const meal: any = data;
    return {
      id: meal.id,
      name: meal.name,
      imageUrl: meal.image_url,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category as any,
      prepTime: meal.prep_time || undefined,
      difficulty: meal.difficulty as any,
      created_at: meal.created_at,
    };
  },

  async createMeal(meal: Omit<Meal, 'id' | 'created_at'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert([
        {
          name: meal.name,
          description: meal.description,
          image_url: meal.imageUrl,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          category: meal.category,
          prep_time: meal.prepTime || null,
          difficulty: meal.difficulty || null,
        },
      ] as any)
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
      category: result.category as any,
      prepTime: result.prep_time || undefined,
      difficulty: result.difficulty as any,
      created_at: result.created_at,
    };
  },

  async updateMeal(id: string, meal: Partial<Omit<Meal, 'id' | 'created_at'>>): Promise<Meal> {
    const updateData: Record<string, any> = {};

    if (meal.name) updateData.name = meal.name;
    if (meal.description) updateData.description = meal.description;
    if (meal.imageUrl) updateData.image_url = meal.imageUrl;
    if (meal.ingredients) updateData.ingredients = meal.ingredients;
    if (meal.instructions) updateData.instructions = meal.instructions;
    if (meal.category) updateData.category = meal.category;
    if (meal.prepTime !== undefined) updateData.prep_time = meal.prepTime;
    if (meal.difficulty !== undefined) updateData.difficulty = meal.difficulty;

    const response: any = await (supabase as any)
      .from('meals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (response.error) throw response.error;
    const result = response.data;

    return {
      id: result.id,
      name: result.name,
      imageUrl: result.image_url,
      description: result.description,
      ingredients: result.ingredients,
      instructions: result.instructions,
      category: result.category as any,
      prepTime: result.prep_time || undefined,
      difficulty: result.difficulty as any,
      created_at: result.created_at,
    };
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) throw error;
  },

  async importMeals(meals: Omit<Meal, 'id' | 'created_at'>[]): Promise<void> {
    const insertData = meals.map(meal => ({
      name: meal.name,
      description: meal.description,
      image_url: meal.imageUrl,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      prep_time: meal.prepTime || null,
      difficulty: meal.difficulty || null,
    }));

    const { error } = await supabase.from('meals').insert(insertData as any);
    if (error) throw error;
  },
};
