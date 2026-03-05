export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: MealCategory;
}

export interface MealMatch extends Meal {
  matchPercentage: number;
}
