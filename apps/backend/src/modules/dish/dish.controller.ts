import { Controller, Get, Param, Query } from '@nestjs/common';
import { DishService } from './dish.service';
import { GetRandomDishDto } from './dto/get-random-dish.dto';

@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Get('random')
  async getRandomDish(@Query() query: GetRandomDishDto) {
    return this.dishService.getRandomDish({
      excludeIds: query.excludeIds ? query.excludeIds.split(',') : [],
      maxHistory: query.maxHistory,
    });
  }

  @Get(':id')
  async getDishById(@Param('id') id: string) {
    return this.dishService.getDishById(id);
  }

  @Get()
  async getAllDishes(@Query('category') category?: string) {
    return this.dishService.getAllDishes({ category: category as any });
  }
}
