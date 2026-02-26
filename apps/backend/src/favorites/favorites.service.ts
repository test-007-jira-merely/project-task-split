import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(private prisma: PrismaService) {}

  async addFavorite(dishId: string, userId?: string) {
    this.logger.log(`Adding favorite: ${dishId} for user: ${userId || 'guest'}`);

    const favorite = await this.prisma.favorite.create({
      data: {
        dishId,
        userId: userId || null,
      },
      include: {
        dish: {
          include: {
            ingredients: true,
          },
        },
      },
    });

    return favorite;
  }

  async removeFavorite(dishId: string, userId?: string) {
    this.logger.log(`Removing favorite: ${dishId} for user: ${userId || 'guest'}`);

    await this.prisma.favorite.deleteMany({
      where: {
        dishId,
        userId: userId || null,
      },
    });

    return { success: true };
  }

  async getFavorites(userId?: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId: userId || null,
      },
      include: {
        dish: {
          include: {
            ingredients: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return favorites;
  }

  async isFavorite(dishId: string, userId?: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        dishId,
        userId: userId || null,
      },
    });

    return !!favorite;
  }
}
