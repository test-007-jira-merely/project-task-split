import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { DishCategory } from '@meal-platform/shared';

@Injectable()
export class DishRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    category?: DishCategory;
    difficulty?: number;
    maxCookTime?: number;
  }) {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }
    if (filters?.maxCookTime) {
      where.cookTime = { lte: filters.maxCookTime };
    }

    return this.prisma.dish.findMany({
      where,
      include: {
        ingredients: true,
        instructions: { orderBy: { step: 'asc' } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: {
        ingredients: true,
        instructions: { orderBy: { step: 'asc' } },
      },
    });
  }

  async findByIds(ids: string[]) {
    return this.prisma.dish.findMany({
      where: { id: { in: ids } },
      include: {
        ingredients: true,
        instructions: { orderBy: { step: 'asc' } },
      },
    });
  }

  async findRandom(excludeIds: string[] = []) {
    const where = excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {};

    const count = await this.prisma.dish.count({ where });
    if (count === 0) return null;

    const skip = Math.floor(Math.random() * count);

    return this.prisma.dish.findFirst({
      where,
      skip,
      include: {
        ingredients: true,
        instructions: { orderBy: { step: 'asc' } },
      },
    });
  }

  async count(filters?: any) {
    return this.prisma.dish.count({ where: filters });
  }
}
