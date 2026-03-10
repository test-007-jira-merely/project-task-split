import { supabase } from '../lib/supabase';
import type { Meal, MealInput, MealDbRecord } from '../types/meal';

// Helper function to convert snake_case DB fields to camelCase
function mapDbRecordToMeal(record: MealDbRecord): Meal {
  return {
    id: record.id,
    name: record.name,
    ingredients: record.ingredients,
    instructions: record.instructions,
    imageUrl: record.image_url,
    prepTime: record.prep_time,
    servings: record.servings,
    userId: record.user_id,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

// Helper function to convert camelCase to snake_case for DB
function mapMealToDbRecord(meal: MealInput): Partial<MealDbRecord> {
  return {
    name: meal.name,
    ingredients: meal.ingredients,
    instructions: meal.instructions,
    image_url: meal.imageUrl,
    prep_time: meal.prepTime,
    servings: meal.servings,
    user_id: meal.userId,
  };
}

// Fetch all meals from the database
export async function getAllMeals(): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch meals: ${error.message}`);
  }

  return (data as MealDbRecord[]).map(mapDbRecordToMeal);
}

// Fetch a single meal by ID
export async function getMealById(id: string): Promise<Meal | null> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch meal: ${error.message}`);
  }

  return mapDbRecordToMeal(data as MealDbRecord);
}

// Create a new meal
export async function createMeal(meal: MealInput): Promise<Meal> {
  const dbRecord = mapMealToDbRecord(meal);

  const { data, error } = await supabase
    .from('meals')
    .insert(dbRecord)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create meal: ${error.message}`);
  }

  return mapDbRecordToMeal(data as MealDbRecord);
}

// Update an existing meal
export async function updateMeal(id: string, meal: Partial<MealInput>): Promise<Meal> {
  const dbRecord = mapMealToDbRecord(meal as MealInput);

  const { data, error } = await supabase
    .from('meals')
    .update(dbRecord)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update meal: ${error.message}`);
  }

  return mapDbRecordToMeal(data as MealDbRecord);
}

// Delete a meal
export async function deleteMeal(id: string): Promise<void> {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete meal: ${error.message}`);
  }
}

// Search meals by ingredients using ingredientMatcher
export async function searchMealsByIngredients(ingredients: string[]): Promise<Meal[]> {
  if (!ingredients || ingredients.length === 0) {
    return [];
  }

  // Fetch all meals and filter based on ingredient matching
  const allMeals = await getAllMeals();

  // Filter meals that contain any of the search ingredients
  const matchedMeals = allMeals.filter(meal => {
    const mealIngredients = meal.ingredients.map(ing => ing.toLowerCase());
    return ingredients.some(searchIng =>
      mealIngredients.some(mealIng =>
        mealIng.includes(searchIng.toLowerCase()) ||
        searchIng.toLowerCase().includes(mealIng)
      )
    );
  });

  return matchedMeals;
}

// Get a random meal, optionally excluding a specific meal ID
export async function getRandomMeal(excludeId?: string): Promise<Meal | null> {
  let query = supabase
    .from('meals')
    .select('*');

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch random meal: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Get a random meal from the results
  const randomIndex = Math.floor(Math.random() * data.length);
  return mapDbRecordToMeal(data[randomIndex] as MealDbRecord);
}

// Bulk import meals
export async function importMeals(meals: MealInput[]): Promise<Meal[]> {
  if (!meals || meals.length === 0) {
    return [];
  }

  const dbRecords = meals.map(mapMealToDbRecord);

  const { data, error } = await supabase
    .from('meals')
    .insert(dbRecords)
    .select();

  if (error) {
    throw new Error(`Failed to import meals: ${error.message}`);
  }

  return (data as MealDbRecord[]).map(mapDbRecordToMeal);
}
