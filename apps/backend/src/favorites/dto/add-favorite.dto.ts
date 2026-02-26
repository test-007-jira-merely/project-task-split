import { IsString, IsOptional } from 'class-validator';

export class AddFavoriteDto {
  @IsString()
  dishId: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
