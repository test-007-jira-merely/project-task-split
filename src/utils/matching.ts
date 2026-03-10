import { stringNormalizer } from './normalization';

export interface MealMatch {
  mealId: string;
  mealName: string;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface IngredientMatcher {
  normalizeIngredient(ingredient: string): string;
  normalizeIngredients(ingredients: string[]): string[];
  calculateMatchPercentage(mealIngredients: string[], availableIngredients: string[]): number;
  findMatchingMeals(meals: Array<{ id: string; name: string; ingredients: string[] }>, availableIngredients: string[]): MealMatch[];
  sortByMatchPercentage(matches: MealMatch[]): MealMatch[];
}

class IngredientMatcherImpl implements IngredientMatcher {
  normalizeIngredient(ingredient: string): string {
    return stringNormalizer.normalize(ingredient);
  }

  normalizeIngredients(ingredients: string[]): string[] {
    return stringNormalizer.deduplicate(ingredients);
  }

  calculateMatchPercentage(mealIngredients: string[], availableIngredients: string[]): number {
    if (mealIngredients.length === 0) {
      return 0;
    }

    const normalizedMealIngredients = mealIngredients.map(i => this.normalizeIngredient(i));
    const normalizedAvailableIngredients = availableIngredients.map(i => this.normalizeIngredient(i));

    let matchCount = 0;
    for (const mealIngredient of normalizedMealIngredients) {
      for (const availableIngredient of normalizedAvailableIngredients) {
        if (stringNormalizer.fuzzyMatch(mealIngredient, availableIngredient)) {
          matchCount++;
          break;
        }
      }
    }

    return (matchCount / normalizedMealIngredients.length) * 100;
  }

  findMatchingMeals(
    meals: Array<{ id: string; name: string; ingredients: string[] }>,
    availableIngredients: string[]
  ): MealMatch[] {
    return meals.map(meal => {
      const normalizedMealIngredients = meal.ingredients.map(i => this.normalizeIngredient(i));
      const normalizedAvailableIngredients = availableIngredients.map(i => this.normalizeIngredient(i));

      const matchedIngredients: string[] = [];
      const missingIngredients: string[] = [];

      for (const mealIngredient of meal.ingredients) {
        const normalizedMealIngredient = this.normalizeIngredient(mealIngredient);
        let isMatched = false;

        for (const availableIngredient of normalizedAvailableIngredients) {
          if (stringNormalizer.fuzzyMatch(normalizedMealIngredient, availableIngredient)) {
            matchedIngredients.push(mealIngredient);
            isMatched = true;
            break;
          }
        }

        if (!isMatched) {
          missingIngredients.push(mealIngredient);
        }
      }

      const matchPercentage = this.calculateMatchPercentage(meal.ingredients, availableIngredients);

      return {
        mealId: meal.id,
        mealName: meal.name,
        matchPercentage,
        matchedIngredients,
        missingIngredients,
      };
    });
  }

  sortByMatchPercentage(matches: MealMatch[]): MealMatch[] {
    return [...matches].sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}

export const ingredientMatcher = new IngredientMatcherImpl();
