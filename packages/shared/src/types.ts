// Shared types contract for meal discovery platform
// This file defines the core domain entities and DTOs used across frontend and backend

export type DishCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  substitutes?: string[]; // Alternative ingredient names
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  category: DishCategory;
  difficulty: DifficultyLevel;
  prepTime: number; // minutes
  cookTime: number; // minutes
  nutrition: Nutrition;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MatchScore {
  dishId: string;
  score: number; // 0-100
  matchedIngredients: string[];
  missingIngredients: string[];
  substitutionMatches: Array<{
    requested: string;
    matched: string;
    confidence: number;
  }>;
  coveragePercentage: number;
}

export interface IngredientMatchRequest {
  ingredients: string[];
  exactMatchOnly?: boolean;
  allowSubstitutions?: boolean;
  minCoverage?: number;
}

export interface IngredientMatchResponse {
  matches: MatchScore[];
  totalResults: number;
}

export interface RandomDishRequest {
  category?: DishCategory;
  excludeIds?: string[]; // For avoiding repetition
  maxDifficulty?: DifficultyLevel;
}

export interface UserPreferences {
  favoriteIds: string[];
  historyIds: string[];
  categoryWeights?: Partial<Record<DishCategory, number>>;
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: Date;
}

// Health check
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    database: 'up' | 'down';
    cache?: 'up' | 'down';
  };
  version: string;
}
