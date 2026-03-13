import { supabase } from './supabase';
import type { Meal } from '@types/meal';

export const mealService = {
  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(meal => ({
      id: meal.id,
      name: meal.name,
      imageUrl: meal.image_url,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category as Meal['category'],
      difficulty: meal.difficulty as Meal['difficulty'],
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

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category as Meal['category'],
      difficulty: data.difficulty as Meal['difficulty'],
      prepTime: data.prep_time || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        name: meal.name,
        description: meal.description,
        image_url: meal.imageUrl,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        difficulty: meal.difficulty || null,
        prep_time: meal.prepTime || null,
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
      category: data.category as Meal['category'],
      difficulty: data.difficulty as Meal['difficulty'],
      prepTime: data.prep_time || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateMeal(id: string, meal: Partial<Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Meal> {
    const updateData: any = {};

    if (meal.name) updateData.name = meal.name;
    if (meal.description) updateData.description = meal.description;
    if (meal.imageUrl) updateData.image_url = meal.imageUrl;
    if (meal.ingredients) updateData.ingredients = meal.ingredients;
    if (meal.instructions) updateData.instructions = meal.instructions;
    if (meal.category) updateData.category = meal.category;
    if (meal.difficulty !== undefined) updateData.difficulty = meal.difficulty;
    if (meal.prepTime !== undefined) updateData.prep_time = meal.prepTime;

    const { data, error } = await supabase
      .from('meals')
      .update(updateData)
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
      category: data.category as Meal['category'],
      difficulty: data.difficulty as Meal['difficulty'],
      prepTime: data.prep_time || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getFavorites(userId: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('meal_id, meals(*)')
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map((fav: any) => ({
      id: fav.meals.id,
      name: fav.meals.name,
      imageUrl: fav.meals.image_url,
      description: fav.meals.description,
      ingredients: fav.meals.ingredients,
      instructions: fav.meals.instructions,
      category: fav.meals.category as Meal['category'],
      difficulty: fav.meals.difficulty as Meal['difficulty'],
      prepTime: fav.meals.prep_time || undefined,
      createdAt: fav.meals.created_at,
      updatedAt: fav.meals.updated_at,
    }));
  },

  async addFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, meal_id: mealId });

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

  async getHistory(userId: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('meal_id, generated_at, meals(*)')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return (data || []).map((history: any) => ({
      id: history.meals.id,
      name: history.meals.name,
      imageUrl: history.meals.image_url,
      description: history.meals.description,
      ingredients: history.meals.ingredients,
      instructions: history.meals.instructions,
      category: history.meals.category as Meal['category'],
      difficulty: history.meals.difficulty as Meal['difficulty'],
      prepTime: history.meals.prep_time || undefined,
      createdAt: history.meals.created_at,
      updatedAt: history.meals.updated_at,
    }));
  },

  async addToHistory(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .insert({ user_id: userId, meal_id: mealId });

    if (error) throw error;
  },
};
