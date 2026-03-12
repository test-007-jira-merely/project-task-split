import { Dish } from './dish.types';

export type MatchType = 'exact' | 'partial' | 'substitution' | 'none';

export interface IngredientMatch {
  dishIngredient: string;
  userIngredient: string;
  matchType: MatchType;
  confidence: number;
  substitutionPath?: string[];
}

export interface MatchScore {
  totalScore: number;
  matchedCount: number;
  totalIngredients: number;
  coveragePercentage: number;
  matches: IngredientMatch[];
  missingIngredients: string[];
}

export interface RankedDish {
  dish: Dish;
  matchScore: MatchScore;
  rank: number;
}

export interface MatchRequest {
  ingredients: string[];
  categories?: string[];
  maxResults?: number;
  minCoverage?: number;
}

export interface MatchResponse {
  results: RankedDish[];
  totalMatches: number;
  searchTime: number;
}
