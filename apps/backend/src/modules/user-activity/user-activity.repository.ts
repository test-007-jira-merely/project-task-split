import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class UserActivityRepository {
  constructor(private prisma: PrismaService) {}

  async createFavorite(userId: string, dishId: string) {
    return this.prisma.favorite.create({
      data: { userId, dishId },
      include: { dish: true },
    });
  }

  async deleteFavorite(userId: string, dishId: string) {
    return this.prisma.favorite.deleteMany({
      where: { userId, dishId },
    });
  }

  async findFavoritesByUserId(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { dish: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isFavorite(userId: string, dishId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_dishId: { userId, dishId },
      },
    });
    return !!favorite;
  }

  async createHistoryEntry(data: {
    userId: string;
    dishId: string;
    action: string;
    rating?: number;
  }) {
    return this.prisma.userHistory.create({
      data,
      include: { dish: true },
    });
  }

  async findHistoryByUserId(
    userId: string,
    options?: {
      limit?: number;
      action?: string;
    },
  ) {
    return this.prisma.userHistory.findMany({
      where: {
        userId,
        ...(options?.action && { action: options.action }),
      },
      include: { dish: true },
      orderBy: { viewedAt: 'desc' },
      ...(options?.limit && { take: options.limit }),
    });
  }

  async getCategoryAffinities(userId: string) {
    const history = await this.prisma.userHistory.findMany({
      where: { userId },
      include: { dish: true },
    });

    const categoryCounts: Record<string, number> = {};
    let total = 0;

    for (const entry of history) {
      const category = entry.dish.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      total++;
    }

    const affinities: Record<string, number> = {};
    for (const [category, count] of Object.entries(categoryCounts)) {
      affinities[category] = count / total;
    }

    return affinities;
  }
}
