export function normalizeMealData(data: any): any {
  return {
    id: data.id,
    name: data.name,
    imageUrl: data.image_url || data.imageUrl,
    description: data.description,
    ingredients: data.ingredients,
    instructions: data.instructions,
    category: data.category,
    difficulty: data.difficulty,
    prepTime: data.prep_time || data.prepTime,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
  };
}

export function toDbFormat(meal: any): any {
  return {
    id: meal.id,
    name: meal.name,
    image_url: meal.imageUrl,
    description: meal.description,
    ingredients: meal.ingredients,
    instructions: meal.instructions,
    category: meal.category,
    difficulty: meal.difficulty,
    prep_time: meal.prepTime,
  };
}
