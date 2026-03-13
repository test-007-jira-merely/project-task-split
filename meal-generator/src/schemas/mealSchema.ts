import { z } from 'zod';

export const mealSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  imageUrl: z.string().url('Must be a valid URL'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient required').max(50, 'Too many ingredients'),
  instructions: z.array(z.string()).min(1, 'At least one instruction required').max(30, 'Too many instructions'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  preparationTime: z.number().min(1).max(600).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type MealFormData = z.infer<typeof mealSchema>;

export const importSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
    category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    preparationTime: z.number().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  })
);
