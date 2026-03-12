/**
 * Shared type definitions for user activity tracking
 * Favorites, history, and recommendation engine
 */

export interface UserFavorite {
  id: string;
  userId: string;
  dishId: string;
  createdAt: Date;
}

export interface UserHistory {
  id: string;
  userId: string;
  dishId: string;
  viewedAt: Date;
  action: 'viewed' | 'cooked' | 'rated';
  rating?: number; // 1-5
}

export interface UserPreferences {
  userId: string;
  categoryAffinities: Record<string, number>; // category -> affinity score
  favoriteIngredients: string[];
  dislikedIngredients: string[];
  difficultyPreference: number; // 1-5
  avgCookTimePreference: number; // minutes
}

export interface RecommendationRequest {
  userId: string;
  limit?: number;
  excludeDishIds?: string[];
  categoryFilter?: string[];
}

export interface RecommendationResponse {
  recommendations: Array<{
    dish: any; // Dish type
    score: number;
    reason: string;
  }>;
  generatedAt: Date;
}

export interface CreateFavoriteDto {
  userId: string;
  dishId: string;
}

export interface CreateHistoryDto {
  userId: string;
  dishId: string;
  action: 'viewed' | 'cooked' | 'rated';
  rating?: number;
}
