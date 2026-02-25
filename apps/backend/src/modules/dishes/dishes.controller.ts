import { Controller, Get, Post, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { DishesService } from './dishes.service';

@ApiTags('dishes')
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post('random')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Generate a random dish' })
  @ApiQuery({ name: 'category', required: false, enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'] })
  @ApiResponse({ status: 200, description: 'Random dish generated successfully' })
  async getRandomDish(@Query('category') category?: string) {
    const dish = await this.dishesService.getRandomDish(category);
    return {
      success: true,
      data: dish,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all dishes with optional filters' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'maxDifficulty', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Dishes retrieved successfully' })
  async getDishes(
    @Query('category') category?: string,
    @Query('maxDifficulty') maxDifficulty?: number
  ) {
    const dishes = await this.dishesService.getDishes({
      category,
      maxDifficulty: maxDifficulty ? Number(maxDifficulty) : undefined,
    });

    return {
      success: true,
      data: dishes,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dish by ID' })
  @ApiResponse({ status: 200, description: 'Dish retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Dish not found' })
  async getDishById(@Param('id') id: string) {
    const dish = await this.dishesService.getDishById(id);
    return {
      success: true,
      data: dish,
      timestamp: new Date().toISOString(),
    };
  }
}
