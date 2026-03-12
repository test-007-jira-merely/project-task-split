import { IsArray, IsBoolean, IsOptional, IsNumber, Min, Max, ArrayMinSize } from 'class-validator';
import { IngredientMatchRequest } from '@meal-platform/shared';
import { Type } from 'class-transformer';

export class IngredientMatchDto implements IngredientMatchRequest {
  @IsArray()
  @ArrayMinSize(1)
  ingredients: string[];

  @IsOptional()
  @IsBoolean()
  exactMatchOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  allowSubstitutions?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  minCoverage?: number;
}
