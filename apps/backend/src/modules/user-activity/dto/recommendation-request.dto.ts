import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class RecommendationRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeDishIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryFilter?: string[];
}
