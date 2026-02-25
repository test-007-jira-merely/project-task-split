import { Injectable, Logger } from '@nestjs/common';
import { MatchType, IngredientMatch } from '@meal-platform/shared-types';

/**
 * Core domain service for ingredient matching logic
 * Implements fuzzy matching, synonym resolution, and substitution logic
 */
@Injectable()
export class IngredientMatcherService {
  private readonly logger = new Logger(IngredientMatcherService.name);

  // Scoring weights
  private readonly EXACT_MATCH_SCORE = 10;
  private readonly PARTIAL_MATCH_SCORE = 5;
  private readonly SUBSTITUTION_MATCH_SCORE = 3;
  private readonly FUZZY_THRESHOLD = 0.75;

  /**
   * Normalize ingredient name for matching
   */
  normalizeIngredient(ingredient: string): string {
    return ingredient
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Tokenize ingredient into searchable terms
   */
  tokenize(ingredient: string): string[] {
    return this.normalizeIngredient(ingredient).split(' ');
  }

  /**
   * Calculate Levenshtein distance for fuzzy matching
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Calculate similarity score between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;

    const distance = this.levenshteinDistance(str1, str2);
    return 1 - distance / maxLength;
  }

  /**
   * Check if ingredient matches exactly
   */
  isExactMatch(userIngredient: string, dishIngredient: string): boolean {
    const normalized1 = this.normalizeIngredient(userIngredient);
    const normalized2 = this.normalizeIngredient(dishIngredient);

    // Direct match
    if (normalized1 === normalized2) return true;

    // Check if one contains the other (e.g., "chicken" matches "chicken breast")
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return true;
    }

    return false;
  }

  /**
   * Check if ingredient matches partially (token-based)
   */
  isPartialMatch(userIngredient: string, dishIngredient: string): boolean {
    const userTokens = this.tokenize(userIngredient);
    const dishTokens = this.tokenize(dishIngredient);

    // Check if any user token matches any dish token
    for (const userToken of userTokens) {
      for (const dishToken of dishTokens) {
        if (userToken === dishToken && userToken.length > 2) {
          return true;
        }

        // Fuzzy match for longer tokens
        if (userToken.length > 3 && dishToken.length > 3) {
          const similarity = this.calculateSimilarity(userToken, dishToken);
          if (similarity >= this.FUZZY_THRESHOLD) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Check if ingredients match via substitution
   */
  isSubstitutionMatch(
    userIngredient: string,
    dishIngredient: string,
    substitutionMap: Map<string, string[]>
  ): { matches: boolean; path?: string[] } {
    const normalized1 = this.normalizeIngredient(userIngredient);
    const normalized2 = this.normalizeIngredient(dishIngredient);

    // Check if dish ingredient has substitutes that match user ingredient
    const substitutes = substitutionMap.get(normalized2) || [];
    for (const substitute of substitutes) {
      if (this.normalizeIngredient(substitute) === normalized1) {
        return { matches: true, path: [normalized2, substitute] };
      }
    }

    // Check reverse: if user ingredient has substitutes that match dish ingredient
    const reverseSubstitutes = substitutionMap.get(normalized1) || [];
    for (const substitute of reverseSubstitutes) {
      if (this.normalizeIngredient(substitute) === normalized2) {
        return { matches: true, path: [normalized1, substitute] };
      }
    }

    return { matches: false };
  }

  /**
   * Apply synonym resolution
   */
  resolveSynonym(ingredient: string, synonymMap: Map<string, string>): string {
    const normalized = this.normalizeIngredient(ingredient);
    return synonymMap.get(normalized) || normalized;
  }

  /**
   * Match a single user ingredient against a dish ingredient
   */
  matchIngredients(
    userIngredient: string,
    dishIngredient: string,
    substitutionMap: Map<string, string[]>,
    synonymMap: Map<string, string>
  ): IngredientMatch | null {
    // Resolve synonyms first
    const resolvedUser = this.resolveSynonym(userIngredient, synonymMap);
    const resolvedDish = this.resolveSynonym(dishIngredient, synonymMap);

    // Check exact match
    if (this.isExactMatch(resolvedUser, resolvedDish)) {
      return {
        dishIngredient,
        userIngredient,
        matchType: 'exact',
        confidence: 1.0,
      };
    }

    // Check partial match
    if (this.isPartialMatch(resolvedUser, resolvedDish)) {
      const similarity = this.calculateSimilarity(
        this.normalizeIngredient(resolvedUser),
        this.normalizeIngredient(resolvedDish)
      );
      return {
        dishIngredient,
        userIngredient,
        matchType: 'partial',
        confidence: similarity,
      };
    }

    // Check substitution match
    const substitutionResult = this.isSubstitutionMatch(
      resolvedUser,
      resolvedDish,
      substitutionMap
    );
    if (substitutionResult.matches) {
      return {
        dishIngredient,
        userIngredient,
        matchType: 'substitution',
        confidence: 0.8,
        substitutionPath: substitutionResult.path,
      };
    }

    return null;
  }

  /**
   * Calculate match score for a complete ingredient list
   */
  calculateMatchScore(
    userIngredients: string[],
    dishIngredients: string[],
    substitutionMap: Map<string, string[]>,
    synonymMap: Map<string, string>
  ): {
    totalScore: number;
    matchedCount: number;
    matches: IngredientMatch[];
    missingIngredients: string[];
  } {
    const matches: IngredientMatch[] = [];
    const matchedDishIngredients = new Set<string>();

    // Try to match each dish ingredient
    for (const dishIngredient of dishIngredients) {
      let bestMatch: IngredientMatch | null = null;
      let bestScore = 0;

      for (const userIngredient of userIngredients) {
        const match = this.matchIngredients(
          userIngredient,
          dishIngredient,
          substitutionMap,
          synonymMap
        );

        if (match) {
          let score = 0;
          switch (match.matchType) {
            case 'exact':
              score = this.EXACT_MATCH_SCORE;
              break;
            case 'partial':
              score = this.PARTIAL_MATCH_SCORE * match.confidence;
              break;
            case 'substitution':
              score = this.SUBSTITUTION_MATCH_SCORE * match.confidence;
              break;
          }

          if (score > bestScore) {
            bestScore = score;
            bestMatch = match;
          }
        }
      }

      if (bestMatch) {
        matches.push(bestMatch);
        matchedDishIngredients.add(dishIngredient);
      }
    }

    // Calculate missing ingredients
    const missingIngredients = dishIngredients.filter(
      (ing) => !matchedDishIngredients.has(ing)
    );

    // Calculate total score
    const totalScore = matches.reduce((sum, match) => {
      switch (match.matchType) {
        case 'exact':
          return sum + this.EXACT_MATCH_SCORE;
        case 'partial':
          return sum + this.PARTIAL_MATCH_SCORE * match.confidence;
        case 'substitution':
          return sum + this.SUBSTITUTION_MATCH_SCORE * match.confidence;
        default:
          return sum;
      }
    }, 0);

    return {
      totalScore,
      matchedCount: matches.length,
      matches,
      missingIngredients,
    };
  }
}
