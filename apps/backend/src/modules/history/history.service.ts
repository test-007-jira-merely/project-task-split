import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { DishesService } from '../dishes/dishes.service';
import { Dish } from '@meal-platform/shared-types';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    private prisma: PrismaService,
    private dishesService: DishesService
  ) {}

  /**
   * Add dish to user's history
   */
  async addToHistory(userId: string, dishId: string, cooked?: boolean): Promise<void> {
    await this.prisma.dishHistory.create({
      data: {
        userId,
        dishId,
        cooked: cooked || false,
      },
    });

    this.logger.log(`Added dish ${dishId} to user ${userId} history`);
  }

  /**
   * Get user's history
   */
  async getUserHistory(userId: string, limit = 50): Promise<Dish[]> {
    const history = await this.prisma.dishHistory.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: limit,
      distinct: ['dishId'],
      select: {
        dishId: true,
      },
    });

    const dishIds = history.map((h) => h.dishId);
    return this.dishesService.getDishesByIds(dishIds);
  }

  /**
   * Get user preferences based on history
   */
  async getUserPreferences(userId: string) {
    const history = await this.prisma.dishHistory.findMany({
      where: { userId },
      include: {
        dish: true,
      },
    });

    // Calculate category preferences
    const categoryCount: Record<string, number> = {};
    for (const item of history) {
      const category = item.dish.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }

    // Sort by frequency
    const favoriteCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);

    return {
      favoriteCategories,
      totalViews: history.length,
      cookedCount: history.filter((h) => h.cooked).length,
    };
  }
}
