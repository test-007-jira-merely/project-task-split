import { IsArray, IsBoolean, IsNumber, IsOptional, ArrayMinSize } from 'class-validator';

export class MatchRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  ingredients: string[];

  @IsOptional()
  @IsBoolean()
  allowSubstitutes?: boolean;

  @IsOptional()
  @IsNumber()
  maxResults?: number;
}
