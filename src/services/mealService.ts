import { supabase } from './supabase';
import { Meal, Favorite, UserHistory } from '@/types/models';

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
      description: meal.description,
      imageUrl: meal.image_url,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category as any,
      preparationTime: meal.preparation_time || undefined,
      difficulty: meal.difficulty as any,
      createdAt: meal.created_at,
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
      description: data.description,
      imageUrl: data.image_url,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category as any,
      preparationTime: data.preparation_time || undefined,
      difficulty: data.difficulty as any,
      createdAt: data.created_at,
    };
  },

  async createMeal(meal: Omit<Meal, 'id' | 'createdAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
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

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      imageUrl: data.image_url,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category as any,
      preparationTime: data.preparation_time || undefined,
      difficulty: data.difficulty as any,
      createdAt: data.created_at,
    };
  },

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    const updateData: any = {};
    if (meal.name) updateData.name = meal.name;
    if (meal.description) updateData.description = meal.description;
    if (meal.imageUrl) updateData.image_url = meal.imageUrl;
    if (meal.ingredients) updateData.ingredients = meal.ingredients;
    if (meal.instructions) updateData.instructions = meal.instructions;
    if (meal.category) updateData.category = meal.category;
    if (meal.preparationTime !== undefined) updateData.preparation_time = meal.preparationTime;
    if (meal.difficulty !== undefined) updateData.difficulty = meal.difficulty;

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
      description: data.description,
      imageUrl: data.image_url,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category as any,
      preparationTime: data.preparation_time || undefined,
      difficulty: data.difficulty as any,
      createdAt: data.created_at,
    };
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async importMeals(meals: Omit<Meal, 'id' | 'createdAt'>[]): Promise<void> {
    const mealsData = meals.map(meal => ({
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
      .insert(mealsData);

    if (error) throw error;
  },

  async getFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        meal:meals(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(fav => ({
      id: fav.id,
      userId: fav.user_id,
      mealId: fav.meal_id,
      createdAt: fav.created_at,
      meal: fav.meal ? {
        id: fav.meal.id,
        name: fav.meal.name,
        description: fav.meal.description,
        imageUrl: fav.meal.image_url,
        ingredients: fav.meal.ingredients,
        instructions: fav.meal.instructions,
        category: fav.meal.category as any,
        preparationTime: fav.meal.preparation_time || undefined,
        difficulty: fav.meal.difficulty as any,
      } : undefined,
    }));
  },

  async addFavorite(userId: string, mealId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        meal_id: mealId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      mealId: data.meal_id,
      createdAt: data.created_at,
    };
  },

  async removeFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  },

  async isFavorite(userId: string, mealId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_id', mealId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async getUserHistory(userId: string): Promise<UserHistory[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select(`
        *,
        meal:meals(*)
      `)
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return (data || []).map(history => ({
      id: history.id,
      userId: history.user_id,
      mealId: history.meal_id,
      generatedAt: history.generated_at,
      meal: history.meal ? {
        id: history.meal.id,
        name: history.meal.name,
        description: history.meal.description,
        imageUrl: history.meal.image_url,
        ingredients: history.meal.ingredients,
        instructions: history.meal.instructions,
        category: history.meal.category as any,
        preparationTime: history.meal.preparation_time || undefined,
        difficulty: history.meal.difficulty as any,
      } : undefined,
    }));
  },

  async addToHistory(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .insert({
        user_id: userId,
        meal_id: mealId,
      });

    if (error) throw error;
  },
};
