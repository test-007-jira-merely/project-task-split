import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class MatchRequestDto {
  @IsArray()
  @IsString({ each: true })
  userIngredients: string[];

  @IsOptional()
  @IsNumber()
  minMatchScore?: number;

  @IsOptional()
  @IsBoolean()
  includeSubstitutions?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryFilter?: string[];
}
