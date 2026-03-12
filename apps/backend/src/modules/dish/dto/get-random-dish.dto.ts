import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetRandomDishDto {
  @IsOptional()
  @IsString()
  excludeIds?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  maxHistory?: number;
}
