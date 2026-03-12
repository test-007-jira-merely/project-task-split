import { Injectable, Logger } from '@nestjs/common';
import { Dish, MatchScore, RankedDish } from '@meal-platform/shared-types';

/**
 * Domain service for ranking and scoring dishes
 */
@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);

  /**
   * Calculate ingredient coverage percentage
   */
  calculateCoverage(matchedCount: number, totalIngredients: number): number {
    if (totalIngredients === 0) return 0;
    return (matchedCount / totalIngredients) * 100;
  }

  /**
   * Rank dishes based on match scores
   * Uses weighted scoring with coverage multiplier
   */
  rankDishes(
    dishes: Dish[],
    matchScores: Map<string, MatchScore>,
    options?: {
      minCoverage?: number;
      categoryWeights?: Map<string, number>;
      difficultyPreference?: number;
    }
  ): RankedDish[] {
    const minCoverage = options?.minCoverage || 0;
    const categoryWeights = options?.categoryWeights || new Map();
    const difficultyPreference = options?.difficultyPreference || 0;

    const rankedDishes: RankedDish[] = [];

    for (const dish of dishes) {
      const matchScore = matchScores.get(dish.id);
      if (!matchScore) continue;

      // Calculate coverage
      const coverage = this.calculateCoverage(
        matchScore.matchedCount,
        matchScore.totalIngredients
      );

      // Skip if below minimum coverage threshold
      if (coverage < minCoverage) continue;

      // Base score from ingredient matching
      let finalScore = matchScore.totalScore;

      // Apply coverage multiplier (dishes with higher coverage get bonus)
      const coverageMultiplier = 1 + coverage / 100;
      finalScore *= coverageMultiplier;

      // Apply category weight if specified
      const categoryWeight = categoryWeights.get(dish.category) || 1.0;
      finalScore *= categoryWeight;

      // Apply difficulty preference (0 = no preference)
      if (difficultyPreference !== 0) {
        const difficultyDiff = Math.abs(dish.difficulty - difficultyPreference);
        const difficultyPenalty = 1 - difficultyDiff * 0.1;
        finalScore *= Math.max(difficultyPenalty, 0.5); // Minimum 50% of score
      }

      // Bonus for fewer missing ingredients
      if (matchScore.missingIngredients.length === 0) {
        finalScore *= 1.5; // 50% bonus for complete match
      }

      rankedDishes.push({
        dish,
        matchScore: {
          ...matchScore,
          coveragePercentage: coverage,
        },
        rank: 0, // Will be assigned after sorting
      });
    }

    // Sort by score (descending) and assign ranks
    rankedDishes.sort((a, b) => {
      const scoreA = a.matchScore.totalScore;
      const scoreB = b.matchScore.totalScore;

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      // Tiebreaker 1: Coverage percentage
      if (b.matchScore.coveragePercentage !== a.matchScore.coveragePercentage) {
        return b.matchScore.coveragePercentage - a.matchScore.coveragePercentage;
      }

      // Tiebreaker 2: Fewer total ingredients (simpler dish)
      return a.matchScore.totalIngredients - b.matchScore.totalIngredients;
    });

    // Assign ranks
    rankedDishes.forEach((item, index) => {
      item.rank = index + 1;
    });

    return rankedDishes;
  }

  /**
   * Apply advanced filtering to ranked results
   */
  filterRankedDishes(
    rankedDishes: RankedDish[],
    filters: {
      maxMissingIngredients?: number;
      categories?: string[];
      minCoveragePercentage?: number;
      maxDifficulty?: number;
      minDifficulty?: number;
    }
  ): RankedDish[] {
    return rankedDishes.filter((item) => {
      // Filter by missing ingredients
      if (
        filters.maxMissingIngredients !== undefined &&
        item.matchScore.missingIngredients.length > filters.maxMissingIngredients
      ) {
        return false;
      }

      // Filter by categories
      if (filters.categories && !filters.categories.includes(item.dish.category)) {
        return false;
      }

      // Filter by coverage percentage
      if (
        filters.minCoveragePercentage !== undefined &&
        item.matchScore.coveragePercentage < filters.minCoveragePercentage
      ) {
        return false;
      }

      // Filter by difficulty range
      if (filters.maxDifficulty !== undefined && item.dish.difficulty > filters.maxDifficulty) {
        return false;
      }

      if (filters.minDifficulty !== undefined && item.dish.difficulty < filters.minDifficulty) {
        return false;
      }

      return true;
    });
  }
}
