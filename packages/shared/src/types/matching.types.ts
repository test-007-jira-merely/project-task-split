/**
 * Shared type definitions for ingredient matching and substitution logic
 * Core contracts for the intelligent matching algorithm
 */

export interface IngredientSubstitution {
  id: string;
  primaryIngredient: string;
  substitutes: string[];
  substitutionScore: number; // 0-1, how good the substitution is
}

export interface IngredientMatch {
  dishId: string;
  matchType: 'exact' | 'partial' | 'substitution';
  matchScore: number; // 0-100
  coveragePercentage: number; // 0-100
  matchedIngredients: string[];
  missingIngredients: string[];
  substitutedIngredients: Array<{
    original: string;
    substitute: string;
    substitutionScore: number;
  }>;
}

export interface MatchRequest {
  userIngredients: string[];
  minMatchScore?: number;
  includeSubstitutions?: boolean;
  categoryFilter?: string[];
}

export interface MatchResponse {
  matches: Array<IngredientMatch & { dish: any }>; // dish will be Dish type
  totalMatches: number;
  executionTimeMs: number;
}

export interface ScoringWeights {
  exactMatchWeight: number;
  partialMatchWeight: number;
  substitutionWeight: number;
  coverageWeight: number;
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  exactMatchWeight: 1.0,
  partialMatchWeight: 0.7,
  substitutionWeight: 0.5,
  coverageWeight: 0.8,
};
