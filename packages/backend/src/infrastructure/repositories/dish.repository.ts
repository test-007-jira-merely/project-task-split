import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Dish, DishCategory, DifficultyLevel, RandomDishRequest } from '@meal-platform/shared';

@Injectable()
export class DishRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options?: {
    category?: DishCategory;
    limit?: number;
    offset?: number;
  }): Promise<{ dishes: Dish[]; total: number }> {
    const { category, limit = 50, offset = 0 } = options || {};

    const where = category ? { category } : {};

    const [dishes, total] = await Promise.all([
      this.prisma.dish.findMany({
        where,
        include: {
          ingredients: true,
          instructions: {
            orderBy: { step: 'asc' }
          }
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.dish.count({ where })
    ]);

    return {
      dishes: dishes.map(dish => this.mapToDto(dish)),
      total
    };
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        ingredients: true,
        instructions: {
          orderBy: { step: 'asc' }
        }
      }
    });

    return dish ? this.mapToDto(dish) : null;
  }

  async findRandom(request: RandomDishRequest): Promise<Dish | null> {
    const { category, excludeIds = [], maxDifficulty } = request;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (excludeIds.length > 0) {
      where.id = { notIn: excludeIds };
    }

    if (maxDifficulty) {
      where.difficulty = { lte: maxDifficulty };
    }

    // Get count of matching dishes
    const count = await this.prisma.dish.count({ where });

    if (count === 0) {
      return null;
    }

    // Get a random offset
    const randomOffset = Math.floor(Math.random() * count);

    const dish = await this.prisma.dish.findFirst({
      where,
      include: {
        ingredients: true,
        instructions: {
          orderBy: { step: 'asc' }
        }
      },
      skip: randomOffset
    });

    return dish ? this.mapToDto(dish) : null;
  }

  async findByIngredients(ingredients: string[]): Promise<Dish[]> {
    // Get all dishes that contain at least one of the provided ingredients
    const dishes = await this.prisma.dish.findMany({
      where: {
        ingredients: {
          some: {
            name: {
              in: ingredients,
              mode: 'insensitive'
            }
          }
        }
      },
      include: {
        ingredients: true,
        instructions: {
          orderBy: { step: 'asc' }
        }
      }
    });

    return dishes.map(dish => this.mapToDto(dish));
  }

  async getAllDishes(): Promise<Dish[]> {
    const dishes = await this.prisma.dish.findMany({
      include: {
        ingredients: true,
        instructions: {
          orderBy: { step: 'asc' }
        }
      }
    });

    return dishes.map(dish => this.mapToDto(dish));
  }

  async getAllIngredientNames(): Promise<string[]> {
    const ingredients = await this.prisma.ingredient.findMany({
      select: { name: true },
      distinct: ['name']
    });

    return ingredients.map(ing => ing.name);
  }

  private mapToDto(dish: any): Dish {
    return {
      id: dish.id,
      name: dish.name,
      description: dish.description,
      imageUrl: dish.imageUrl,
      ingredients: dish.ingredients.map((ing: any) => ({
        id: ing.id,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        substitutes: ing.substitutes
      })),
      instructions: dish.instructions
        .sort((a: any, b: any) => a.step - b.step)
        .map((inst: any) => inst.content),
      category: dish.category as DishCategory,
      difficulty: dish.difficulty as DifficultyLevel,
      prepTime: dish.prepTime,
      cookTime: dish.cookTime,
      nutrition: {
        calories: dish.calories,
        protein: dish.protein,
        fat: dish.fat,
        carbs: dish.carbs
      },
      tags: dish.tags,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt
    };
  }
}
