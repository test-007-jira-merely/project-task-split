import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class DishesService {
  private readonly logger = new Logger(DishesService.name);
  private recentDishes: string[] = []; // Track last N dishes to avoid repetition
  private readonly maxRecentDishes = 10;

  constructor(private prisma: PrismaService) {}

  /**
   * Get a random dish with weighted randomness to avoid repetition
   */
  async getRandomDish() {
    this.logger.log('Generating random dish');

    // Get all dishes
    const dishes = await this.prisma.dish.findMany({
      include: {
        ingredients: true,
      },
    });

    if (dishes.length === 0) {
      throw new NotFoundException('No dishes found in database');
    }

    // Filter out recently shown dishes if possible
    let availableDishes = dishes.filter(
      (dish) => !this.recentDishes.includes(dish.id),
    );

    // If all dishes have been shown recently, reset
    if (availableDishes.length === 0) {
      this.logger.log('All dishes shown recently, resetting pool');
      this.recentDishes = [];
      availableDishes = dishes;
    }

    // Select random dish
    const randomIndex = Math.floor(Math.random() * availableDishes.length);
    const selectedDish = availableDishes[randomIndex];

    // Track this dish
    this.recentDishes.push(selectedDish.id);
    if (this.recentDishes.length > this.maxRecentDishes) {
      this.recentDishes.shift();
    }

    return this.formatDish(selectedDish);
  }

  /**
   * Get all dishes
   */
  async getAllDishes() {
    const dishes = await this.prisma.dish.findMany({
      include: {
        ingredients: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return dishes.map((dish) => this.formatDish(dish));
  }

  /**
   * Get dishes by category
   */
  async getDishesByCategory(category: Category) {
    const dishes = await this.prisma.dish.findMany({
      where: {
        category,
      },
      include: {
        ingredients: true,
      },
    });

    return dishes.map((dish) => this.formatDish(dish));
  }

  /**
   * Get a single dish by ID
   */
  async getDishById(id: string) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        ingredients: true,
      },
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return this.formatDish(dish);
  }

  /**
   * Search dishes by name or tags
   */
  async searchDishes(query: string) {
    const dishes = await this.prisma.dish.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              hasSome: [query.toLowerCase()],
            },
          },
        ],
      },
      include: {
        ingredients: true,
      },
    });

    return dishes.map((dish) => this.formatDish(dish));
  }

  /**
   * Format dish data for API response
   */
  private formatDish(dish: any) {
    return {
      id: dish.id,
      name: dish.name,
      description: dish.description,
      imageUrl: dish.imageUrl,
      category: dish.category,
      difficulty: dish.difficulty,
      prepTime: dish.prepTime,
      cookTime: dish.cookTime,
      instructions: dish.instructions as string[],
      nutrition: dish.nutrition as {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
      },
      tags: dish.tags,
      ingredients: dish.ingredients.map((ing: any) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        substitutes: ing.substitutes,
      })),
    };
  }
}
