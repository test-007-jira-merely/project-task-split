import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';

@Controller('user-activity')
export class UserActivityController {
  constructor(private readonly service: UserActivityService) {}

  @Post('favorites')
  async addFavorite(@Body() dto: CreateFavoriteDto) {
    return this.service.addFavorite(dto);
  }

  @Delete('favorites/:userId/:dishId')
  async removeFavorite(@Param('userId') userId: string, @Param('dishId') dishId: string) {
    await this.service.removeFavorite(userId, dishId);
    return { success: true };
  }

  @Get('favorites/:userId')
  async getUserFavorites(@Param('userId') userId: string) {
    return this.service.getUserFavorites(userId);
  }

  @Post('history')
  async addHistoryEntry(@Body() dto: CreateHistoryDto) {
    return this.service.addHistoryEntry(dto);
  }

  @Get('history/:userId')
  async getUserHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('action') action?: string,
  ) {
    return this.service.getUserHistory(userId, {
      limit: limit ? parseInt(limit) : undefined,
      action: action as any,
    });
  }

  @Get('preferences/:userId')
  async getUserPreferences(@Param('userId') userId: string) {
    return this.service.getUserPreferences(userId);
  }

  @Post('recommendations')
  async getRecommendations(@Body() dto: RecommendationRequestDto) {
    return this.service.getRecommendations(dto);
  }
}
