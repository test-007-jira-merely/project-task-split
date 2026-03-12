import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { DishesService } from '../dishes/dishes.service';
import { Dish } from '@meal-platform/shared-types';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    private prisma: PrismaService,
    private dishesService: DishesService
  ) {}

  /**
   * Add dish to favorites
   */
  async addFavorite(userId: string, dishId: string): Promise<void> {
    await this.prisma.userFavorite.upsert({
      where: {
        userId_dishId: {
          userId,
          dishId,
        },
      },
      create: {
        userId,
        dishId,
      },
      update: {},
    });

    this.logger.log(`User ${userId} favorited dish ${dishId}`);
  }

  /**
   * Remove dish from favorites
   */
  async removeFavorite(userId: string, dishId: string): Promise<void> {
    await this.prisma.userFavorite.deleteMany({
      where: {
        userId,
        dishId,
      },
    });

    this.logger.log(`User ${userId} unfavorited dish ${dishId}`);
  }

  /**
   * Get user's favorite dishes
   */
  async getUserFavorites(userId: string): Promise<Dish[]> {
    const favorites = await this.prisma.userFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        dishId: true,
      },
    });

    const dishIds = favorites.map((fav) => fav.dishId);
    return this.dishesService.getDishesByIds(dishIds);
  }

  /**
   * Check if dish is favorited by user
   */
  async isFavorited(userId: string, dishId: string): Promise<boolean> {
    const favorite = await this.prisma.userFavorite.findUnique({
      where: {
        userId_dishId: {
          userId,
          dishId,
        },
      },
    });

    return !!favorite;
  }
}
