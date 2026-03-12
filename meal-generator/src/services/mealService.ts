import { supabase } from './supabase';
import { IMealService } from './interfaces';
import { Meal, MealFilter, IngredientMatch } from '@/types';
import { ingredientMatcher } from '@/utils/ingredientMatcher';

class MealService implements IMealService {
  private dbToMeal(dbMeal: any): Meal {
    return {
      id: dbMeal.id,
      name: dbMeal.name,
      description: dbMeal.description,
      imageUrl: dbMeal.image_url,
      ingredients: dbMeal.ingredients,
      instructions: dbMeal.instructions,
      category: dbMeal.category,
      preparationTime: dbMeal.preparation_time,
      difficulty: dbMeal.difficulty,
      createdAt: dbMeal.created_at,
      updatedAt: dbMeal.updated_at,
    };
  }

  private mealToDb(meal: Partial<Meal>): any {
    return {
      name: meal.name,
      description: meal.description,
      image_url: meal.imageUrl,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      preparation_time: meal.preparationTime,
      difficulty: meal.difficulty,
    };
  }

  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.dbToMeal);
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

    return this.dbToMeal(data);
  }

  async getRandomMeal(excludeId?: string): Promise<Meal | null> {
    let query = supabase
      .from('meals')
      .select('*');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * data.length);
    return this.dbToMeal(data[randomIndex]);
  }

  async createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert(this.mealToDb(meal))
      .select()
      .single();

    if (error) throw error;
    return this.dbToMeal(data);
  }

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .update({
        ...this.mealToDb(meal),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.dbToMeal(data);
  }

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async importMeals(meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ imported: number; skipped: number }> {
    let imported = 0;
    let skipped = 0;

    for (const meal of meals) {
      // Check if meal already exists by name
      const { data: existing } = await supabase
        .from('meals')
        .select('id')
        .eq('name', meal.name)
        .single();

      if (existing) {
        skipped++;
        continue;
      }

      try {
        await this.createMeal(meal);
        imported++;
      } catch (error) {
        console.error(`Failed to import meal: ${meal.name}`, error);
        skipped++;
      }
    }

    return { imported, skipped };
  }

  async filterMeals(filter: MealFilter): Promise<Meal[]> {
    let query = supabase.from('meals').select('*');

    if (filter.category) {
      query = query.eq('category', filter.category);
    }

    if (filter.difficulty) {
      query = query.eq('difficulty', filter.difficulty);
    }

    if (filter.maxPreparationTime) {
      query = query.lte('preparation_time', filter.maxPreparationTime);
    }

    const { data, error } = await query;

    if (error) throw error;

    let meals = data.map(this.dbToMeal);

    // Client-side ingredient filtering if provided
    if (filter.ingredients && filter.ingredients.length > 0) {
      const matches = ingredientMatcher.filterByIngredients(meals, filter.ingredients);
      meals = matches.map(m => m.meal);
    }

    return meals;
  }

  async searchMealsByIngredients(ingredients: string[]): Promise<IngredientMatch[]> {
    const allMeals = await this.getAllMeals();
    return ingredientMatcher.filterByIngredients(allMeals, ingredients);
  }
}

export const mealService = new MealService();
