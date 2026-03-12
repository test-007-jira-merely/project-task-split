import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { DishesService } from '../dishes/dishes.service';
import { IngredientMatcherService } from '../../domain/services/ingredient-matcher.service';
import { RankingService } from '../../domain/services/ranking.service';
import { MatchRequest, MatchResponse, MatchScore } from '@meal-platform/shared-types';

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);
  private substitutionCache: Map<string, string[]> | null = null;
  private synonymCache: Map<string, string> | null = null;

  constructor(
    private prisma: PrismaService,
    private dishesService: DishesService,
    private ingredientMatcher: IngredientMatcherService,
    private rankingService: RankingService
  ) {}

  /**
   * Load and cache substitution mappings
   */
  private async getSubstitutionMap(): Promise<Map<string, string[]>> {
    if (this.substitutionCache) {
      return this.substitutionCache;
    }

    const substitutions = await this.prisma.ingredientSubstitution.findMany();
    const map = new Map<string, string[]>();

    for (const sub of substitutions) {
      const normalizedName = this.ingredientMatcher.normalizeIngredient(sub.ingredientName);
      map.set(normalizedName, sub.substitutes);
    }

    this.substitutionCache = map;
    this.logger.log(`Loaded ${map.size} ingredient substitution rules`);
    return map;
  }

  /**
   * Load and cache synonym mappings
   */
  private async getSynonymMap(): Promise<Map<string, string>> {
    if (this.synonymCache) {
      return this.synonymCache;
    }

    const synonyms = await this.prisma.ingredientSynonym.findMany();
    const map = new Map<string, string>();

    for (const syn of synonyms) {
      map.set(syn.term, syn.canonical);
    }

    this.synonymCache = map;
    this.logger.log(`Loaded ${map.size} ingredient synonyms`);
    return map;
  }

  /**
   * Match user ingredients against dish database
   */
  async matchIngredients(request: MatchRequest): Promise<MatchResponse> {
    const startTime = Date.now();

    // Load caches
    const [substitutionMap, synonymMap] = await Promise.all([
      this.getSubstitutionMap(),
      this.getSynonymMap(),
    ]);

    // Get dishes to search
    const dishes = await this.dishesService.getDishes({
      category: request.categories?.[0],
    });

    this.logger.log(
      `Matching ${request.ingredients.length} ingredients against ${dishes.length} dishes`
    );

    // Calculate match scores for all dishes
    const matchScores = new Map<string, MatchScore>();

    for (const dish of dishes) {
      const dishIngredientNames = dish.ingredients.map((ing) => ing.name);

      const matchResult = this.ingredientMatcher.calculateMatchScore(
        request.ingredients,
        dishIngredientNames,
        substitutionMap,
        synonymMap
      );

      const coverage = this.rankingService.calculateCoverage(
        matchResult.matchedCount,
        dishIngredientNames.length
      );

      matchScores.set(dish.id, {
        totalScore: matchResult.totalScore,
        matchedCount: matchResult.matchedCount,
        totalIngredients: dishIngredientNames.length,
        coveragePercentage: coverage,
        matches: matchResult.matches,
        missingIngredients: matchResult.missingIngredients,
      });
    }

    // Rank dishes
    let rankedDishes = this.rankingService.rankDishes(dishes, matchScores, {
      minCoverage: request.minCoverage || 0,
    });

    // Apply additional filters
    rankedDishes = this.rankingService.filterRankedDishes(rankedDishes, {
      categories: request.categories,
      minCoveragePercentage: request.minCoverage,
    });

    // Limit results
    const maxResults = request.maxResults || 20;
    rankedDishes = rankedDishes.slice(0, maxResults);

    const searchTime = Date.now() - startTime;

    this.logger.log(
      `Found ${rankedDishes.length} matching dishes in ${searchTime}ms`
    );

    return {
      results: rankedDishes,
      totalMatches: rankedDishes.length,
      searchTime,
    };
  }

  /**
   * Clear caches (useful for testing or after data updates)
   */
  clearCaches() {
    this.substitutionCache = null;
    this.synonymCache = null;
    this.logger.log('Caches cleared');
  }
}
