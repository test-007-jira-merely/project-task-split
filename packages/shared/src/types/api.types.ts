import { z } from 'zod';
import { DishSchema, MatchResultSchema } from './dish.types';

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    timestamp: z.string(),
  });

export const RandomDishResponseSchema = ApiResponseSchema(DishSchema);
export type RandomDishResponse = z.infer<typeof RandomDishResponseSchema>;

export const MatchRequestSchema = z.object({
  ingredients: z.array(z.string()),
  allowSubstitutes: z.boolean().default(true),
  maxResults: z.number().default(10),
});
export type MatchRequest = z.infer<typeof MatchRequestSchema>;

export const MatchResponseSchema = ApiResponseSchema(z.array(MatchResultSchema));
export type MatchResponse = z.infer<typeof MatchResponseSchema>;

export const HealthResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
