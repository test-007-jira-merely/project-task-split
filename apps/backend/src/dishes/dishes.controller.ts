import { Controller, Get, Param, Query } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { createSuccessResponse } from '../common/decorators/api-response.decorator';
import { Category } from '@prisma/client';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get('random')
  async getRandomDish() {
    const dish = await this.dishesService.getRandomDish();
    return createSuccessResponse(dish);
  }

  @Get('search')
  async searchDishes(@Query('q') query: string) {
    const dishes = await this.dishesService.searchDishes(query);
    return createSuccessResponse(dishes);
  }

  @Get('category/:category')
  async getDishesByCategory(@Param('category') category: Category) {
    const dishes = await this.dishesService.getDishesByCategory(category);
    return createSuccessResponse(dishes);
  }

  @Get(':id')
  async getDishById(@Param('id') id: string) {
    const dish = await this.dishesService.getDishById(id);
    return createSuccessResponse(dish);
  }

  @Get()
  async getAllDishes() {
    const dishes = await this.dishesService.getAllDishes();
    return createSuccessResponse(dishes);
  }
}
