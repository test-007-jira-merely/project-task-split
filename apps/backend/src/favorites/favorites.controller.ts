import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { createSuccessResponse } from '../common/decorators/api-response.decorator';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(@Body() dto: AddFavoriteDto) {
    const favorite = await this.favoritesService.addFavorite(
      dto.dishId,
      dto.userId,
    );
    return createSuccessResponse(favorite);
  }

  @Delete()
  async removeFavorite(@Body() dto: AddFavoriteDto) {
    const result = await this.favoritesService.removeFavorite(
      dto.dishId,
      dto.userId,
    );
    return createSuccessResponse(result);
  }

  @Get()
  async getFavorites(@Query('userId') userId?: string) {
    const favorites = await this.favoritesService.getFavorites(userId);
    return createSuccessResponse(favorites);
  }

  @Get('check')
  async isFavorite(
    @Query('dishId') dishId: string,
    @Query('userId') userId?: string,
  ) {
    const isFavorite = await this.favoritesService.isFavorite(dishId, userId);
    return createSuccessResponse({ isFavorite });
  }
}
