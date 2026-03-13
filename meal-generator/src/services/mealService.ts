import { supabase } from './supabase'
import type { Meal } from '../types/meal'

export const mealService = {
  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(meal => ({
      id: meal.id,
      name: meal.name,
      imageUrl: meal.image_url,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      preparationTime: meal.preparation_time,
      difficulty: meal.difficulty,
    }))
  },

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category,
      preparationTime: data.preparation_time,
      difficulty: data.difficulty,
    }
  },

  async createMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        name: meal.name,
        image_url: meal.imageUrl,
        description: meal.description,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        preparation_time: meal.preparationTime,
        difficulty: meal.difficulty,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category,
      preparationTime: data.preparation_time,
      difficulty: data.difficulty,
    }
  },

  async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    const updates: any = {}
    if (meal.name !== undefined) updates.name = meal.name
    if (meal.imageUrl !== undefined) updates.image_url = meal.imageUrl
    if (meal.description !== undefined) updates.description = meal.description
    if (meal.ingredients !== undefined) updates.ingredients = meal.ingredients
    if (meal.instructions !== undefined) updates.instructions = meal.instructions
    if (meal.category !== undefined) updates.category = meal.category
    if (meal.preparationTime !== undefined) updates.preparation_time = meal.preparationTime
    if (meal.difficulty !== undefined) updates.difficulty = meal.difficulty

    const { data, error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      category: data.category,
      preparationTime: data.preparation_time,
      difficulty: data.difficulty,
    }
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
