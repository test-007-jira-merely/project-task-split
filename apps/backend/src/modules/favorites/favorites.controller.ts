import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, description: 'Favorites retrieved successfully' })
  async getFavorites(@Query('userId') userId: string) {
    const favorites = await this.favoritesService.getUserFavorites(userId);

    return {
      success: true,
      data: favorites,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':dishId')
  @ApiOperation({ summary: 'Add dish to favorites' })
  @ApiParam({ name: 'dishId', description: 'Dish ID to favorite' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, description: 'Dish added to favorites' })
  async addFavorite(@Param('dishId') dishId: string, @Query('userId') userId: string) {
    await this.favoritesService.addFavorite(userId, dishId);

    return {
      success: true,
      message: 'Dish added to favorites',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':dishId')
  @ApiOperation({ summary: 'Remove dish from favorites' })
  @ApiParam({ name: 'dishId', description: 'Dish ID to unfavorite' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, description: 'Dish removed from favorites' })
  async removeFavorite(@Param('dishId') dishId: string, @Query('userId') userId: string) {
    await this.favoritesService.removeFavorite(userId, dishId);

    return {
      success: true,
      message: 'Dish removed from favorites',
      timestamp: new Date().toISOString(),
    };
  }
}
