import { z } from 'zod';

export const DishCategorySchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack']);
export type DishCategory = z.infer<typeof DishCategorySchema>;

export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.string().optional(),
  unit: z.string().optional(),
  substitutes: z.array(z.string()).optional(),
});
export type Ingredient = z.infer<typeof IngredientSchema>;

export const NutritionSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  fat: z.number(),
  carbs: z.number(),
});
export type Nutrition = z.infer<typeof NutritionSchema>;

export const DishSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  ingredients: z.array(IngredientSchema),
  instructions: z.array(z.string()),
  category: DishCategorySchema,
  difficulty: z.number().min(1).max(5),
  prepTime: z.number(),
  cookTime: z.number(),
  nutrition: NutritionSchema,
  tags: z.array(z.string()).optional(),
});
export type Dish = z.infer<typeof DishSchema>;

export const MatchResultSchema = z.object({
  dish: DishSchema,
  matchScore: z.number(),
  coverage: z.number(),
  matchedIngredients: z.array(z.string()),
  missingIngredients: z.array(z.string()),
  substitutedIngredients: z.array(z.object({
    original: z.string(),
    substitute: z.string(),
    confidence: z.number(),
  })),
});
export type MatchResult = z.infer<typeof MatchResultSchema>;

export const FavoriteSchema = z.object({
  id: z.string(),
  dishId: z.string(),
  userId: z.string().optional(),
  createdAt: z.date(),
});
export type Favorite = z.infer<typeof FavoriteSchema>;

export const HistoryEntrySchema = z.object({
  id: z.string(),
  dishId: z.string(),
  userId: z.string().optional(),
  viewedAt: z.date(),
});
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;
