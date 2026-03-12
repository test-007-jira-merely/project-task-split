import { Injectable, NotFoundException } from '@nestjs/common';
import { DishRepository } from './dish.repository';
import { Dish, DishCategory } from '@meal-platform/shared';

@Injectable()
export class DishService {
  constructor(private readonly dishRepository: DishRepository) {}

  async getRandomDish(options?: {
    excludeIds?: string[];
    maxHistory?: number;
  }): Promise<Dish> {
    const excludeIds = options?.excludeIds || [];
    const dish = await this.dishRepository.findRandom(excludeIds);

    if (!dish) {
      throw new NotFoundException('No dishes available');
    }

    return this.mapToDish(dish);
  }

  async getDishById(id: string): Promise<Dish | null> {
    const dish = await this.dishRepository.findById(id);
    if (!dish) {
      throw new NotFoundException(`Dish with id ${id} not found`);
    }
    return this.mapToDish(dish);
  }

  async getAllDishes(filters?: {
    category?: DishCategory;
    difficulty?: number;
    maxCookTime?: number;
  }): Promise<Dish[]> {
    const dishes = await this.dishRepository.findAll(filters);
    return dishes.map((dish) => this.mapToDish(dish));
  }

  async getDishesByIds(ids: string[]): Promise<Dish[]> {
    const dishes = await this.dishRepository.findByIds(ids);
    return dishes.map((dish) => this.mapToDish(dish));
  }

  private mapToDish(dish: any): Dish {
    return {
      id: dish.id,
      name: dish.name,
      description: dish.description,
      imageUrl: dish.imageUrl,
      category: dish.category as DishCategory,
      difficulty: dish.difficulty as any,
      prepTime: dish.prepTime,
      cookTime: dish.cookTime,
      nutrition: dish.nutrition as any,
      ingredients: dish.ingredients.map((ing: any) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        category: ing.category,
      })),
      instructions: dish.instructions.map((inst: any) => inst.text),
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    };
  }
}
