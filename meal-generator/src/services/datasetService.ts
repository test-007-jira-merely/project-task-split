import { mealService } from './mealService';
import type { Meal } from '../types';

export const datasetService = {
  async importFromJSON(jsonData: string) {
    try {
      const meals = JSON.parse(jsonData) as Omit<Meal, 'id' | 'created_at'>[];

      if (!Array.isArray(meals)) {
        throw new Error('Invalid JSON format. Expected an array of meals.');
      }

      const results = await Promise.allSettled(
        meals.map((meal) => mealService.createMeal(meal))
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      return { successful, failed, total: meals.length };
    } catch (error) {
      throw new Error('Failed to parse JSON: ' + (error as Error).message);
    }
  },

  getSampleJSONStructure() {
    return JSON.stringify([
      {
        name: "Classic Pancakes",
        imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759",
        description: "Fluffy buttermilk pancakes perfect for breakfast",
        ingredients: [
          "2 cups all-purpose flour",
          "2 tablespoons sugar",
          "2 teaspoons baking powder",
          "1 teaspoon salt",
          "2 eggs",
          "1.5 cups milk",
          "1/4 cup melted butter"
        ],
        instructions: [
          "Mix dry ingredients in a large bowl",
          "Whisk eggs, milk, and melted butter in another bowl",
          "Combine wet and dry ingredients until just mixed",
          "Heat griddle to medium-high heat",
          "Pour 1/4 cup batter for each pancake",
          "Cook until bubbles form, then flip",
          "Serve hot with syrup and butter"
        ],
        category: "breakfast",
        difficulty: "easy",
        prepTime: 20
      }
    ], null, 2);
  },
};
