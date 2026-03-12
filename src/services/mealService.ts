import { supabase } from './supabase';
import { Meal, MealCategory } from '../types/database';
import { IngredientMatch } from '../types/store';
import { IMealService, IFavoriteService, IHistoryService } from '../types/mealService.interface';

export class MealService implements IMealService {
  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(this.mapDbMealToMeal);
  }

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapDbMealToMeal(data);
  }

  async createMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        name: meal.name,
        description: meal.description,
        image_url: meal.imageUrl,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        difficulty: meal.difficulty,
        prep_time: meal.prepTime,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbMealToMeal(data);
  }

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
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
    return this.mapDbMealToMeal(data);
  }

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async importMeals(meals: Omit<Meal, 'id'>[]): Promise<Meal[]> {
    const insertData = meals.map(meal => ({
      name: meal.name,
      description: meal.description,
      image_url: meal.imageUrl,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      difficulty: meal.difficulty,
      prep_time: meal.prepTime,
    }));

    const { data, error } = await supabase
      .from('meals')
      .insert(insertData)
      .select();

    if (error) throw error;
    return data.map(this.mapDbMealToMeal);
  }

  async getRandomMeal(excludeId?: string): Promise<Meal | null> {
    let query = supabase.from('meals').select('*');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * data.length);
    return this.mapDbMealToMeal(data[randomIndex]);
  }

  async filterMealsByCategory(category: MealCategory): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('category', category);

    if (error) throw error;
    return data.map(this.mapDbMealToMeal);
  }

  async findMealsByIngredients(ingredients: string[]): Promise<IngredientMatch[]> {
    const normalizedUserIngredients = ingredients.map(i => this.normalizeIngredient(i));

    const allMeals = await this.getAllMeals();

    const matches = allMeals.map(meal => {
      const match = this.calculateIngredientMatch(meal.ingredients, normalizedUserIngredients);
      return {
        meal,
        ...match,
      };
    });

    return matches
      .filter(m => m.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  calculateIngredientMatch(mealIngredients: string[], userIngredients: string[]): {
    matchPercentage: number;
    matchedIngredients: string[];
    missingIngredients: string[];
  } {
    const normalizedMealIngredients = mealIngredients.map(i => this.normalizeIngredient(i));
    const normalizedUserIngredients = userIngredients.map(i => this.normalizeIngredient(i));

    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];

    normalizedMealIngredients.forEach((mealIng, idx) => {
      const isMatched = normalizedUserIngredients.some(userIng =>
        mealIng.includes(userIng) || userIng.includes(mealIng)
      );

      if (isMatched) {
        matchedIngredients.push(mealIngredients[idx]);
      } else {
        missingIngredients.push(mealIngredients[idx]);
      }
    });

    const matchPercentage = normalizedMealIngredients.length > 0
      ? Math.round((matchedIngredients.length / normalizedMealIngredients.length) * 100)
      : 0;

    return {
      matchPercentage,
      matchedIngredients,
      missingIngredients,
    };
  }

  normalizeIngredient(ingredient: string): string {
    return ingredient.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  private mapDbMealToMeal(dbMeal: any): Meal {
    return {
      id: dbMeal.id,
      name: dbMeal.name,
      description: dbMeal.description,
      imageUrl: dbMeal.image_url,
      ingredients: dbMeal.ingredients,
      instructions: dbMeal.instructions,
      category: dbMeal.category,
      difficulty: dbMeal.difficulty,
      prepTime: dbMeal.prep_time,
    };
  }
}

export class FavoriteService implements IFavoriteService {
  async getUserFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('meal_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map(f => f.meal_id);
  }

  async addFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, meal_id: mealId });

    if (error) throw error;
  }

  async removeFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  }

  async isFavorite(userId: string, mealId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_id', mealId)
      .single();

    return !error && data !== null;
  }
}

export class HistoryService implements IHistoryService {
  async getUserHistory(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_history')
      .select('meal_id')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data.map(h => h.meal_id);
  }

  async addToHistory(userId: string, mealId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .insert({ user_id: userId, meal_id: mealId });

    if (error) throw error;
  }

  async clearHistory(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
}

export const mealService = new MealService();
export const favoriteService = new FavoriteService();
export const historyService = new HistoryService();
