import { IsArray, IsString, IsOptional, IsNumber, Min, Max, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MatchRequestDto {
  @ApiProperty({
    description: 'List of available ingredients',
    example: ['chicken', 'garlic', 'olive oil', 'tomato'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one ingredient is required' })
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({
    description: 'Filter by categories',
    example: ['dinner', 'lunch'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({
    description: 'Maximum number of results to return',
    example: 20,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxResults?: number;

  @ApiProperty({
    description: 'Minimum coverage percentage (0-100)',
    example: 50,
    required: false,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minCoverage?: number;
}
