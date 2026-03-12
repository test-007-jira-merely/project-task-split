import { supabase } from './supabase';
import { Meal } from '@/types/meal';

export const getFavorites = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('meal_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data as any[]).map((f: any) => f.meal_id);
};

export const addFavorite = async (userId: string, mealId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, meal_id: mealId } as any);

  if (error) throw error;
};

export const removeFavorite = async (userId: string, mealId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('meal_id', mealId);

  if (error) throw error;
};

export const getHistory = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('user_history')
    .select('meal_id')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data as any[]).map((h: any) => h.meal_id);
};

export const addToHistory = async (userId: string, mealId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_history')
    .insert({ user_id: userId, meal_id: mealId } as any);

  if (error) throw error;
};

export const getMeals = async (): Promise<Meal[]> => {
  const { data, error } = await supabase.from('meals').select('*');

  if (error) throw error;

  return (data as any[]).map((m: any) => ({
    id: m.id,
    name: m.name,
    imageUrl: m.image_url,
    description: m.description,
    ingredients: m.ingredients,
    instructions: m.instructions,
    category: m.category as any,
    prepTime: m.prep_time,
    difficulty: m.difficulty as any,
  }));
};

export const createMeal = async (meal: Omit<Meal, 'id'>): Promise<Meal> => {
  const { data, error } = await supabase
    .from('meals')
    .insert({
      name: meal.name,
      description: meal.description,
      image_url: meal.imageUrl,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      prep_time: meal.prepTime,
      difficulty: meal.difficulty,
    } as any)
    .select()
    .single();

  if (error) throw error;

  const m = data as any;
  return {
    id: m.id,
    name: m.name,
    imageUrl: m.image_url,
    description: m.description,
    ingredients: m.ingredients,
    instructions: m.instructions,
    category: m.category as any,
    prepTime: m.prep_time,
    difficulty: m.difficulty as any,
  };
};

export const updateMeal = async (id: string, meal: Partial<Meal>): Promise<Meal> => {
  const updateData: any = {};
  if (meal.name) updateData.name = meal.name;
  if (meal.description) updateData.description = meal.description;
  if (meal.imageUrl) updateData.image_url = meal.imageUrl;
  if (meal.ingredients) updateData.ingredients = meal.ingredients;
  if (meal.instructions) updateData.instructions = meal.instructions;
  if (meal.category) updateData.category = meal.category;
  if (meal.prepTime) updateData.prep_time = meal.prepTime;
  if (meal.difficulty) updateData.difficulty = meal.difficulty;

  const { data, error } = await (supabase
    .from('meals')
    .update as any)(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  const m = data as any;
  return {
    id: m.id,
    name: m.name,
    imageUrl: m.image_url,
    description: m.description,
    ingredients: m.ingredients,
    instructions: m.instructions,
    category: m.category as any,
    prepTime: m.prep_time,
    difficulty: m.difficulty as any,
  };
};

export const deleteMeal = async (id: string): Promise<void> => {
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) throw error;
};

export const importMeals = async (meals: Meal[]): Promise<void> => {
  const insertData = meals.map(m => ({
    id: m.id,
    name: m.name,
    description: m.description,
    image_url: m.imageUrl,
    ingredients: m.ingredients,
    instructions: m.instructions,
    category: m.category,
    prep_time: m.prepTime,
    difficulty: m.difficulty,
  }));

  const { error } = await supabase.from('meals').insert(insertData as any);
  if (error) throw error;
};
