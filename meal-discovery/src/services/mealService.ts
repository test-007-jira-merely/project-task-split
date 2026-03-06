import { supabase } from './supabase';
import { Meal, SupabaseMeal } from '@/types';
import { IMealService } from '@/types/services';

class MealService implements IMealService {
  private transformFromSupabase(data: SupabaseMeal): Meal {
    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category,
      prepTime: data.prep_time,
      difficulty: data.difficulty as "easy" | "medium" | "hard" | undefined,
    };
  }

  private transformToSupabase(meal: Meal | Omit<Meal, 'id'>): Omit<SupabaseMeal, 'id' | 'created_at'> {
    return {
      name: meal.name,
      description: meal.description,
      image_url: meal.imageUrl,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      prep_time: meal.prepTime,
      difficulty: meal.difficulty,
    };
  }

  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.transformFromSupabase);
  }

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.transformFromSupabase(data);
  }

  async createMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert([this.transformToSupabase(meal)])
      .select()
      .single();

    if (error) throw error;
    return this.transformFromSupabase(data);
  }

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    const updates: any = {};
    if (meal.name) updates.name = meal.name;
    if (meal.description) updates.description = meal.description;
    if (meal.imageUrl) updates.image_url = meal.imageUrl;
    if (meal.ingredients) updates.ingredients = meal.ingredients;
    if (meal.instructions) updates.instructions = meal.instructions;
    if (meal.category) updates.category = meal.category;
    if (meal.prepTime !== undefined) updates.prep_time = meal.prepTime;
    if (meal.difficulty) updates.difficulty = meal.difficulty;

    const { data, error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.transformFromSupabase(data);
  }

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async importMeals(meals: Meal[]): Promise<void> {
    const supabaseMeals = meals.map(this.transformToSupabase);
    const { error } = await supabase
      .from('meals')
      .insert(supabaseMeals);

    if (error) throw error;
  }
}

export const mealService = new MealService();
