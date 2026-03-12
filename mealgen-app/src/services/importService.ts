import { supabaseHelpers } from './supabase';

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

export async function importMealsFromJSON(file: File): Promise<ImportResult> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Handle both array and object with meals property
    const meals: any[] = Array.isArray(data) ? data : data.meals || [];

    if (!Array.isArray(meals) || meals.length === 0) {
      throw new Error('JSON must contain an array of meals');
    }

    const errors: string[] = [];
    let imported = 0;

    for (const meal of meals) {
      try {
        // Validate required fields
        if (!meal.name || !meal.description || !meal.imageUrl || !meal.ingredients || !meal.instructions || !meal.category) {
          errors.push(`Skipped meal "${meal.name || 'Unknown'}": Missing required fields`);
          continue;
        }

        // Create meal in database
        await supabaseHelpers.createMeal({
          name: meal.name,
          description: meal.description,
          image_url: meal.imageUrl,
          ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
          instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
          category: meal.category,
          preparation_time: meal.preparationTime || null,
          difficulty: meal.difficulty || null,
        });
        imported++;
      } catch (error: any) {
        errors.push(`Failed to import "${meal.name}": ${error.message}`);
      }
    }

    return { success: errors.length === 0, imported, errors };
  } catch (error: any) {
    return { success: false, imported: 0, errors: [error.message] };
  }
}

export function validateMealData(meal: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!meal.name || typeof meal.name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  if (!meal.description || typeof meal.description !== 'string') {
    errors.push('Description is required and must be a string');
  }
  if (!meal.imageUrl || typeof meal.imageUrl !== 'string') {
    errors.push('Image URL is required and must be a string');
  }
  if (!meal.category || !['breakfast', 'lunch', 'dinner', 'snack'].includes(meal.category)) {
    errors.push('Category must be one of: breakfast, lunch, dinner, snack');
  }
  if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
    errors.push('Ingredients must be a non-empty array');
  }
  if (!Array.isArray(meal.instructions) || meal.instructions.length === 0) {
    errors.push('Instructions must be a non-empty array');
  }

  return { valid: errors.length === 0, errors };
}
