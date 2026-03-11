export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
  difficulty?: "easy" | "medium" | "hard";
  prepTimeMinutes?: number;
}

export interface IngredientMatch {
  mealId: string;
  ingredient: string;
  normalizedIngredient: string;
  matchScore: number;
}

export interface MealMatchResult {
  meal: Meal;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface MealFilterCriteria {
  categories: MealCategory[];
  ingredients: string[];
  sortBy: "best-match" | "random" | "category";
  difficulty?: Array<"easy" | "medium" | "hard">;
  maxPrepTime?: number;
}
