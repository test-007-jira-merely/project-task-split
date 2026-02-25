import { Controller, Get, Post, Param, Query, Body, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Dish, ApiResponse, IngredientMatchResponse } from '@meal-platform/shared';
import { RandomDishDto } from '../../application/dto/random-dish.dto';
import { IngredientMatchDto } from '../../application/dto/ingredient-match.dto';
import { DishRepository } from '../../infrastructure/repositories/dish.repository';
import { MatchingAlgorithmService } from '../../domain/services/matching-algorithm.service';
import { LoggerService } from '../../infrastructure/logging/logger.service';

@Controller('api/dishes')
export class DishesController {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly matchingAlgorithm: MatchingAlgorithmService,
    private readonly logger: LoggerService
  ) {}

  @Get('random')
  async getRandomDish(
    @Query(new ValidationPipe({ transform: true })) query: RandomDishDto
  ): Promise<ApiResponse<Dish>> {
    this.logger.log('Getting random dish', 'DishesController');

    const dish = await this.dishRepository.findRandom(query);

    if (!dish) {
      throw new NotFoundException('No dishes found matching the criteria');
    }

    return {
      data: dish,
      success: true,
      timestamp: new Date()
    };
  }

  @Get(':id')
  async getDishById(@Param('id') id: string): Promise<ApiResponse<Dish>> {
    this.logger.log(`Getting dish by id: ${id}`, 'DishesController');

    const dish = await this.dishRepository.findById(id);

    if (!dish) {
      throw new NotFoundException(`Dish with id ${id} not found`);
    }

    return {
      data: dish,
      success: true,
      timestamp: new Date()
    };
  }

  @Get()
  async getAllDishes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string
  ): Promise<ApiResponse<{ dishes: Dish[]; total: number; page: number; limit: number }>> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offset = (pageNum - 1) * limitNum;

    this.logger.log(`Getting dishes - page: ${pageNum}, limit: ${limitNum}`, 'DishesController');

    const { dishes, total } = await this.dishRepository.findAll({
      category: category as any,
      limit: limitNum,
      offset
    });

    return {
      data: {
        dishes,
        total,
        page: pageNum,
        limit: limitNum
      },
      success: true,
      timestamp: new Date()
    };
  }

  @Post('match')
  async matchIngredients(
    @Body(ValidationPipe) body: IngredientMatchDto
  ): Promise<ApiResponse<IngredientMatchResponse>> {
    this.logger.log(`Matching ingredients: ${body.ingredients.join(', ')}`, 'DishesController');

    // Get all dishes
    const allDishes = await this.dishRepository.getAllDishes();

    // Find matches using the algorithm
    const matches = this.matchingAlgorithm.findMatches(
      body.ingredients,
      allDishes,
      {
        exactMatchOnly: body.exactMatchOnly || false,
        allowSubstitutions: body.allowSubstitutions !== false,
        minCoverage: body.minCoverage || 0,
        fuzzyThreshold: 0.8
      }
    );

    return {
      data: {
        matches,
        totalResults: matches.length
      },
      success: true,
      timestamp: new Date()
    };
  }

  @Get('ingredients/suggestions')
  async getIngredientSuggestions(
    @Query('q') query: string
  ): Promise<ApiResponse<string[]>> {
    if (!query || query.length < 2) {
      return {
        data: [],
        success: true,
        timestamp: new Date()
      };
    }

    const allIngredients = await this.dishRepository.getAllIngredientNames();
    const normalizedQuery = query.toLowerCase();

    const suggestions = allIngredients
      .filter(ing => ing.toLowerCase().includes(normalizedQuery))
      .slice(0, 10);

    return {
      data: suggestions,
      success: true,
      timestamp: new Date()
    };
  }
}
