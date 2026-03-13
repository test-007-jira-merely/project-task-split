import { supabase } from './supabase';
import { Meal } from '@/types/meal';

export const mealService = {
  async getAll(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((meal) => ({
      id: meal.id,
      name: meal.name,
      imageUrl: meal.image_url,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      preparationTime: meal.preparation_time ?? undefined,
      difficulty: meal.difficulty ?? undefined,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at,
    }));
  },

  async getById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category,
      preparationTime: data.preparation_time ?? undefined,
      difficulty: data.difficulty ?? undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async create(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        name: meal.name,
        image_url: meal.imageUrl,
        description: meal.description,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        preparation_time: meal.preparationTime ?? null,
        difficulty: meal.difficulty ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category,
      preparationTime: data.preparation_time ?? undefined,
      difficulty: data.difficulty ?? undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async update(id: string, meal: Partial<Meal>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .update({
        ...(meal.name && { name: meal.name }),
        ...(meal.imageUrl && { image_url: meal.imageUrl }),
        ...(meal.description && { description: meal.description }),
        ...(meal.ingredients && { ingredients: meal.ingredients }),
        ...(meal.instructions && { instructions: meal.instructions }),
        ...(meal.category && { category: meal.category }),
        ...(meal.preparationTime !== undefined && { preparation_time: meal.preparationTime }),
        ...(meal.difficulty !== undefined && { difficulty: meal.difficulty }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category,
      preparationTime: data.preparation_time ?? undefined,
      difficulty: data.difficulty ?? undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) throw error;
  },

  async importBulk(meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    const { error } = await supabase.from('meals').insert(
      meals.map((meal) => ({
        name: meal.name,
        image_url: meal.imageUrl,
        description: meal.description,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        preparation_time: meal.preparationTime ?? null,
        difficulty: meal.difficulty ?? null,
      }))
    );

    if (error) throw error;
  },
};
