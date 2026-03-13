import { supabase } from './supabase';
import type { Meal, Favorite, UserHistory } from '../types';

export const mealService = {
  // Meal CRUD
  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapMealFromDB);
  },

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? this.mapMealFromDB(data) : null;
  },

  async createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert([this.mapMealToDB(meal)])
      .select()
      .single();

    if (error) throw error;
    return this.mapMealFromDB(data);
  },

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .update(this.mapMealToDB(meal))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapMealFromDB(data);
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async importMeals(meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .insert(meals.map(this.mapMealToDB));

    if (error) throw error;
  },

  // Favorites
  async getFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, meals(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(fav => ({
      id: fav.id,
      userId: fav.user_id,
      mealId: fav.meal_id,
      meal: fav.meals ? this.mapMealFromDB(fav.meals) : undefined,
      createdAt: fav.created_at,
    }));
  },

  async addFavorite(userId: string, mealId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, meal_id: mealId }])
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

  // History
  async getHistory(userId: string): Promise<UserHistory[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('*, meals(*)')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return data.map(hist => ({
      id: hist.id,
      userId: hist.user_id,
      mealId: hist.meal_id,
      meal: hist.meals ? this.mapMealFromDB(hist.meals) : undefined,
      generatedAt: hist.generated_at,
    }));
  },

  async addToHistory(userId: string, mealId: string): Promise<UserHistory> {
    const { data, error } = await supabase
      .from('user_history')
      .insert([{ user_id: userId, meal_id: mealId }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      mealId: data.meal_id,
      generatedAt: data.generated_at,
    };
  },

  // Mapping helpers
  mapMealFromDB(data: any): Meal {
    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category,
      difficulty: data.difficulty,
      prepTime: data.prep_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  mapMealToDB(meal: Partial<Meal>): any {
    return {
      name: meal.name,
      image_url: meal.imageUrl,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      difficulty: meal.difficulty,
      prep_time: meal.prepTime,
    };
  },
};
