import { supabase } from './supabase';
import type { Meal, Favorite, History } from '../types';

export const fetchMeals = async (): Promise<Meal[]> => {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((meal) => ({
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
};

export const createMeal = async (meal: Omit<Meal, 'id' | 'created_at'>): Promise<Meal> => {
  const { data, error } = await supabase
    .from('meals')
    .insert({
      name: meal.name,
      description: meal.description,
      image_url: meal.imageUrl,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      prep_time: meal.prepTime || null,
      difficulty: meal.difficulty || null,
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
    category: data.category as any,
    prepTime: data.prep_time || undefined,
    difficulty: data.difficulty as any,
    created_at: data.created_at,
  };
};

export const updateMeal = async (id: string, meal: Partial<Meal>): Promise<Meal> => {
  const updateData: any = {};
  if (meal.name !== undefined) updateData.name = meal.name;
  if (meal.description !== undefined) updateData.description = meal.description;
  if (meal.imageUrl !== undefined) updateData.image_url = meal.imageUrl;
  if (meal.ingredients !== undefined) updateData.ingredients = meal.ingredients;
  if (meal.instructions !== undefined) updateData.instructions = meal.instructions;
  if (meal.category !== undefined) updateData.category = meal.category;
  if (meal.prepTime !== undefined) updateData.prep_time = meal.prepTime;
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
    imageUrl: data.image_url,
    description: data.description,
    ingredients: data.ingredients,
    instructions: data.instructions,
    category: data.category as any,
    prepTime: data.prep_time || undefined,
    difficulty: data.difficulty as any,
    created_at: data.created_at,
  };
};

export const deleteMeal = async (id: string): Promise<void> => {
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) throw error;
};

export const fetchFavorites = async (userId: string): Promise<Favorite[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addFavorite = async (userId: string, mealId: string): Promise<Favorite> => {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, meal_id: mealId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFavorite = async (favoriteId: string): Promise<void> => {
  const { error } = await supabase.from('favorites').delete().eq('id', favoriteId);
  if (error) throw error;
};

export const fetchHistory = async (userId: string): Promise<History[]> => {
  const { data, error } = await supabase
    .from('user_history')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
};

export const addHistory = async (userId: string, mealId: string): Promise<History> => {
  const { data, error } = await supabase
    .from('user_history')
    .insert({ user_id: userId, meal_id: mealId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const importMealsFromJSON = async (meals: Omit<Meal, 'id' | 'created_at'>[]): Promise<void> => {
  const insertData = meals.map((meal) => ({
    name: meal.name,
    description: meal.description,
    image_url: meal.imageUrl,
    ingredients: meal.ingredients,
    instructions: meal.instructions,
    category: meal.category,
    prep_time: meal.prepTime || null,
    difficulty: meal.difficulty || null,
  }));

  const { error } = await supabase.from('meals').insert(insertData);
  if (error) throw error;
};
