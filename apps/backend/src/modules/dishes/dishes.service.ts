import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Dish } from '@meal-platform/shared-types';

@Injectable()
export class DishesService {
  private readonly logger = new Logger(DishesService.name);
  private recentlyGenerated: string[] = [];
  private readonly MAX_RECENT = 10;

  constructor(private prisma: PrismaService) {}

  /**
   * Map database dish to domain model
   */
  private mapToDish(dish: any): Dish {
    return {
      id: dish.id,
      name: dish.name,
      description: dish.description,
      imageUrl: dish.imageUrl,
      category: dish.category,
      difficulty: dish.difficulty as any,
      prepTime: dish.prepTime,
      cookTime: dish.cookTime,
      servings: dish.servings,
      tags: dish.tags,
      ingredients: dish.ingredients.map((ing: any) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        optional: ing.optional,
      })),
      instructions: dish.instructions
        .sort((a: any, b: any) => a.order - b.order)
        .map((inst: any) => inst.step),
      nutrition: dish.nutrition,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    };
  }

  /**
   * Get random dish with weighted selection and anti-repetition
   */
  async getRandomDish(category?: string): Promise<Dish> {
    const where = category ? { category } : {};

    // Get count first
    const count = await this.prisma.dish.count({ where });

    if (count === 0) {
      throw new NotFoundException('No dishes available');
    }

    // Get available dishes (exclude recently generated)
    const dishes = await this.prisma.dish.findMany({
      where: {
        ...where,
        id: {
          notIn: this.recentlyGenerated,
        },
      },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        instructions: {
          orderBy: { order: 'asc' },
        },
        nutrition: true,
      },
    });

    if (dishes.length === 0) {
      // Reset if all dishes have been shown
      this.recentlyGenerated = [];
      return this.getRandomDish(category);
    }

    // Weighted random selection (favor lower difficulty for variety)
    const weights = dishes.map((dish) => {
      const difficultyWeight = 6 - dish.difficulty; // Difficulty 1 = weight 5, difficulty 5 = weight 1
      return difficultyWeight;
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    let selectedDish = dishes[0];
    for (let i = 0; i < dishes.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedDish = dishes[i];
        break;
      }
    }

    // Track recently generated
    this.recentlyGenerated.push(selectedDish.id);
    if (this.recentlyGenerated.length > this.MAX_RECENT) {
      this.recentlyGenerated.shift();
    }

    this.logger.log(`Generated random dish: ${selectedDish.name}`);
    return this.mapToDish(selectedDish);
  }

  /**
   * Get dish by ID
   */
  async getDishById(id: string): Promise<Dish> {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        instructions: {
          orderBy: { order: 'asc' },
        },
        nutrition: true,
      },
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return this.mapToDish(dish);
  }

  /**
   * Get all dishes with optional filters
   */
  async getDishes(filters?: {
    category?: string;
    maxDifficulty?: number;
    tags?: string[];
  }): Promise<Dish[]> {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.maxDifficulty) {
      where.difficulty = {
        lte: filters.maxDifficulty,
      };
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    const dishes = await this.prisma.dish.findMany({
      where,
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        instructions: {
          orderBy: { order: 'asc' },
        },
        nutrition: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return dishes.map((dish) => this.mapToDish(dish));
  }

  /**
   * Get dishes by IDs
   */
  async getDishesByIds(ids: string[]): Promise<Dish[]> {
    const dishes = await this.prisma.dish.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        instructions: {
          orderBy: { order: 'asc' },
        },
        nutrition: true,
      },
    });

    return dishes.map((dish) => this.mapToDish(dish));
  }
}
