import { IsString, IsOptional } from 'class-validator';

export class AddHistoryDto {
  @IsString()
  dishId: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
