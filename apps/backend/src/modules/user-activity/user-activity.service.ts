import { Injectable } from '@nestjs/common';
import { UserActivityRepository } from './user-activity.repository';
import { DishService } from '../dish/dish.service';
import {
  UserFavorite,
  UserHistory,
  UserPreferences,
  RecommendationResponse,
} from '@meal-platform/shared';

@Injectable()
export class UserActivityService {
  constructor(
    private readonly repository: UserActivityRepository,
    private readonly dishService: DishService,
  ) {}

  async addFavorite(dto: { userId: string; dishId: string }): Promise<UserFavorite> {
    const favorite = await this.repository.createFavorite(dto.userId, dto.dishId);
    return {
      id: favorite.id,
      userId: favorite.userId,
      dishId: favorite.dishId,
      createdAt: favorite.createdAt,
    };
  }

  async removeFavorite(userId: string, dishId: string): Promise<void> {
    await this.repository.deleteFavorite(userId, dishId);
  }

  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    const favorites = await this.repository.findFavoritesByUserId(userId);
    return favorites.map((fav) => ({
      id: fav.id,
      userId: fav.userId,
      dishId: fav.dishId,
      createdAt: fav.createdAt,
    }));
  }

  async isFavorite(userId: string, dishId: string): Promise<boolean> {
    return this.repository.isFavorite(userId, dishId);
  }

  async addHistoryEntry(dto: {
    userId: string;
    dishId: string;
    action: 'viewed' | 'cooked' | 'rated';
    rating?: number;
  }): Promise<UserHistory> {
    const entry = await this.repository.createHistoryEntry(dto);
    return {
      id: entry.id,
      userId: entry.userId,
      dishId: entry.dishId,
      viewedAt: entry.viewedAt,
      action: entry.action as any,
      rating: entry.rating || undefined,
    };
  }

  async getUserHistory(
    userId: string,
    options?: {
      limit?: number;
      action?: 'viewed' | 'cooked' | 'rated';
    },
  ): Promise<UserHistory[]> {
    const history = await this.repository.findHistoryByUserId(userId, options);
    return history.map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      dishId: entry.dishId,
      viewedAt: entry.viewedAt,
      action: entry.action as any,
      rating: entry.rating || undefined,
    }));
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const categoryAffinities = await this.calculateCategoryAffinities(userId);
    const history = await this.repository.findHistoryByUserId(userId);

    // Calculate average difficulty and cook time from history
    let totalDifficulty = 0;
    let totalCookTime = 0;
    let count = 0;

    for (const entry of history) {
      if (entry.dish) {
        totalDifficulty += entry.dish.difficulty;
        totalCookTime += entry.dish.cookTime;
        count++;
      }
    }

    const difficultyPreference = count > 0 ? totalDifficulty / count : 3;
    const avgCookTimePreference = count > 0 ? totalCookTime / count : 30;

    // Extract favorite and disliked ingredients (simplified)
    const favoriteIngredients: string[] = [];
    const dislikedIngredients: string[] = [];

    return {
      userId,
      categoryAffinities,
      favoriteIngredients,
      dislikedIngredients,
      difficultyPreference: Math.round(difficultyPreference),
      avgCookTimePreference: Math.round(avgCookTimePreference),
    };
  }

  async getRecommendations(request: {
    userId: string;
    limit?: number;
    excludeDishIds?: string[];
    categoryFilter?: string[];
  }): Promise<RecommendationResponse> {
    const limit = request.limit || 10;
    const excludeIds = request.excludeDishIds || [];

    // Get user preferences
    const preferences = await this.getUserPreferences(request.userId);

    // Get all dishes
    const allDishes = await this.dishService.getAllDishes();

    // Filter and score dishes
    const scoredDishes = allDishes
      .filter((dish) => !excludeIds.includes(dish.id))
      .filter((dish) => {
        if (request.categoryFilter && request.categoryFilter.length > 0) {
          return request.categoryFilter.includes(dish.category);
        }
        return true;
      })
      .map((dish) => {
        let score = 0;
        let reason = '';

        // Category affinity
        const categoryAffinity = preferences.categoryAffinities[dish.category] || 0;
        score += categoryAffinity * 50;
        if (categoryAffinity > 0.3) {
          reason = `You often enjoy ${dish.category} dishes`;
        }

        // Difficulty preference
        const difficultyDiff = Math.abs(dish.difficulty - preferences.difficultyPreference);
        score += (5 - difficultyDiff) * 10;

        // Cook time preference
        const timeDiff = Math.abs(dish.cookTime - preferences.avgCookTimePreference);
        score += Math.max(0, 20 - timeDiff / 5);

        if (!reason) {
          reason = 'Based on your preferences';
        }

        return { dish, score, reason };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      recommendations: scoredDishes,
      generatedAt: new Date(),
    };
  }

  async calculateCategoryAffinities(userId: string): Promise<Record<string, number>> {
    return this.repository.getCategoryAffinities(userId);
  }
}
