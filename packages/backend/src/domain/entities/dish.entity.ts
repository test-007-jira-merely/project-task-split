import { Dish as DishType, Ingredient, Nutrition, DishCategory, DifficultyLevel } from '@meal-platform/shared';

export class DishEntity implements DishType {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  category: DishCategory;
  difficulty: DifficultyLevel;
  prepTime: number;
  cookTime: number;
  nutrition: Nutrition;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<DishEntity>) {
    Object.assign(this, partial);
  }

  get totalTime(): number {
    return this.prepTime + this.cookTime;
  }

  hasIngredient(ingredientName: string): boolean {
    return this.ingredients.some(
      ing => ing.name.toLowerCase() === ingredientName.toLowerCase()
    );
  }

  getIngredientNames(): string[] {
    return this.ingredients.map(ing => ing.name.toLowerCase());
  }
}
