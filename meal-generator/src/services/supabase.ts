import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import type { Meal, Favorite, UserHistory, User } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser(): Promise<SupabaseUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }
};

export const mealsService = {
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
      category: meal.category,
      difficulty: meal.difficulty,
      prepTime: meal.prep_time,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at
    }));
  },

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    if (!data) return null;

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
      updatedAt: data.updated_at
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
        prep_time: meal.prepTime
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
      difficulty: data.difficulty,
      prepTime: data.prep_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    const updateData: Record<string, unknown> = {};
    if (meal.name !== undefined) updateData.name = meal.name;
    if (meal.imageUrl !== undefined) updateData.image_url = meal.imageUrl;
    if (meal.description !== undefined) updateData.description = meal.description;
    if (meal.ingredients !== undefined) updateData.ingredients = meal.ingredients;
    if (meal.instructions !== undefined) updateData.instructions = meal.instructions;
    if (meal.category !== undefined) updateData.category = meal.category;
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
      category: data.category,
      difficulty: data.difficulty,
      prepTime: data.prep_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async bulkCreateMeals(meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    const insertData = meals.map(meal => ({
      name: meal.name,
      image_url: meal.imageUrl,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      difficulty: meal.difficulty,
      prep_time: meal.prepTime
    }));

    const { error } = await supabase
      .from('meals')
      .insert(insertData);

    if (error) throw error;
  }
};

export const favoritesService = {
  async getFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('meal_id')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(fav => fav.meal_id);
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
  }
};

export const historyService = {
  async getHistory(userId: string): Promise<UserHistory[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return (data || []).map(h => ({
      id: h.id,
      userId: h.user_id,
      mealId: h.meal_id,
      generatedAt: h.generated_at
    }));
  },

  async addToHistory(userId: string, mealId: string): Promise<UserHistory> {
    const { data, error } = await supabase
      .from('user_history')
      .insert({ user_id: userId, meal_id: mealId })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      userId: data.user_id,
      mealId: data.meal_id,
      generatedAt: data.generated_at
    };
  }
};
