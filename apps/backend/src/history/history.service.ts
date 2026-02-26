import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(private prisma: PrismaService) {}

  async addToHistory(dishId: string, userId?: string) {
    this.logger.log(`Adding to history: ${dishId} for user: ${userId || 'guest'}`);

    const entry = await this.prisma.historyEntry.create({
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

    return entry;
  }

  async getHistory(userId?: string, limit: number = 50) {
    const history = await this.prisma.historyEntry.findMany({
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
        viewedAt: 'desc',
      },
      take: limit,
    });

    return history;
  }

  async clearHistory(userId?: string) {
    await this.prisma.historyEntry.deleteMany({
      where: {
        userId: userId || null,
      },
    });

    return { success: true };
  }
}
