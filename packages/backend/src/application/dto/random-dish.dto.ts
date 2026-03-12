import { IsOptional, IsEnum, IsArray, IsInt, Min, Max } from 'class-validator';
import { DishCategory, DifficultyLevel, RandomDishRequest } from '@meal-platform/shared';
import { Type } from 'class-transformer';

export class RandomDishDto implements RandomDishRequest {
  @IsOptional()
  @IsEnum(['breakfast', 'lunch', 'dinner', 'snack'])
  category?: DishCategory;

  @IsOptional()
  @IsArray()
  excludeIds?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  maxDifficulty?: DifficultyLevel;
}
