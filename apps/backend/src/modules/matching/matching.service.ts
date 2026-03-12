import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { DishService } from '../dish/dish.service';
import * as stringSimilarity from 'string-similarity';
import {
  MatchRequest,
  MatchResponse,
  IngredientSubstitution,
  IngredientMatch,
} from '@meal-platform/shared';

@Injectable()
export class MatchingService implements OnModuleInit {
  private substitutionsCache: Map<string, IngredientSubstitution> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly dishService: DishService,
  ) {}

  async onModuleInit() {
    await this.loadSubstitutions();
  }

  async findMatchingDishes(request: MatchRequest): Promise<MatchResponse> {
    const startTime = Date.now();
    const {
      userIngredients,
      minMatchScore = 30,
      includeSubstitutions = true,
      categoryFilter,
    } = request;

    // Normalize user ingredients
    const normalizedUserIngredients = userIngredients.map((ing) =>
      this.normalizeIngredient(ing),
    );

    // Get all dishes
    const dishes = await this.dishService.getAllDishes();

    // Calculate matches
    const matches: Array<IngredientMatch & { dish: any }> = [];

    for (const dish of dishes) {
      // Apply category filter
      if (categoryFilter && categoryFilter.length > 0) {
        if (!categoryFilter.includes(dish.category)) {
          continue;
        }
      }

      const matchResult = await this.calculateMatchScore(
        dish.ingredients.map((ing) => ing.name),
        normalizedUserIngredients,
        includeSubstitutions,
      );

      if (matchResult.score >= minMatchScore) {
        const matchType: 'exact' | 'partial' | 'substitution' =
          matchResult.substituted.length > 0
            ? 'substitution'
            : matchResult.coverage === 100
            ? 'exact'
            : 'partial';

        matches.push({
          dishId: dish.id,
          matchType,
          matchScore: matchResult.score,
          coveragePercentage: matchResult.coverage,
          matchedIngredients: matchResult.matched,
          missingIngredients: matchResult.missing,
          substitutedIngredients: matchResult.substituted,
          dish,
        });
      }
    }

    // Sort by match score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    const executionTimeMs = Date.now() - startTime;

    return {
      matches,
      totalMatches: matches.length,
      executionTimeMs,
    };
  }

  normalizeIngredient(ingredient: string): string {
    let normalized = ingredient.toLowerCase().trim();

    // Remove common plurals
    if (normalized.endsWith('ies')) {
      normalized = normalized.slice(0, -3) + 'y';
    } else if (normalized.endsWith('es')) {
      normalized = normalized.slice(0, -2);
    } else if (normalized.endsWith('s')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  }

  isSimilarIngredient(
    ingredient1: string,
    ingredient2: string,
    threshold: number = 0.75,
  ): boolean {
    const similarity = stringSimilarity.compareTwoStrings(ingredient1, ingredient2);
    return similarity >= threshold;
  }

  async getSubstitutions(ingredient: string): Promise<IngredientSubstitution | null> {
    const normalized = this.normalizeIngredient(ingredient);
    return this.substitutionsCache.get(normalized) || null;
  }

  async calculateMatchScore(
    dishIngredients: string[],
    userIngredients: string[],
    includeSubstitutions: boolean,
  ): Promise<{
    score: number;
    coverage: number;
    matched: string[];
    missing: string[];
    substituted: Array<{ original: string; substitute: string; score: number }>;
  }> {
    const normalizedDishIngredients = dishIngredients.map((ing) =>
      this.normalizeIngredient(ing),
    );

    const matched: string[] = [];
    const missing: string[] = [];
    const substituted: Array<{ original: string; substitute: string; score: number }> = [];

    for (const dishIng of normalizedDishIngredients) {
      let isMatched = false;

      // Check exact match
      for (const userIng of userIngredients) {
        if (dishIng === userIng) {
          matched.push(dishIng);
          isMatched = true;
          break;
        }
      }

      if (!isMatched) {
        // Check fuzzy match
        for (const userIng of userIngredients) {
          if (this.isSimilarIngredient(dishIng, userIng)) {
            matched.push(dishIng);
            isMatched = true;
            break;
          }
        }
      }

      if (!isMatched && includeSubstitutions) {
        // Check substitutions
        const substitution = await this.getSubstitutions(dishIng);
        if (substitution) {
          for (const substitute of substitution.substitutes) {
            const normalizedSub = this.normalizeIngredient(substitute);
            for (const userIng of userIngredients) {
              if (normalizedSub === userIng || this.isSimilarIngredient(normalizedSub, userIng)) {
                matched.push(dishIng);
                substituted.push({
                  original: dishIng,
                  substitute: normalizedSub,
                  score: substitution.substitutionScore,
                });
                isMatched = true;
                break;
              }
            }
            if (isMatched) break;
          }
        }
      }

      if (!isMatched) {
        missing.push(dishIng);
      }
    }

    // Calculate coverage
    const coverage = (matched.length / normalizedDishIngredients.length) * 100;

    // Calculate score with weighted factors
    let score = 0;
    const exactMatches = matched.length - substituted.length;

    // Exact matches get full weight
    score += (exactMatches / normalizedDishIngredients.length) * 100;

    // Substitutions get partial weight
    if (substituted.length > 0) {
      const avgSubScore =
        substituted.reduce((sum, sub) => sum + sub.score, 0) / substituted.length;
      score += ((substituted.length / normalizedDishIngredients.length) * 100) * avgSubScore;
    }

    return {
      score: Math.round(score),
      coverage: Math.round(coverage * 100) / 100,
      matched,
      missing,
      substituted,
    };
  }

  async loadSubstitutions(): Promise<void> {
    const substitutions = await this.prisma.substitution.findMany();

    for (const sub of substitutions) {
      const normalized = this.normalizeIngredient(sub.primaryIngredient);
      this.substitutionsCache.set(normalized, {
        id: sub.id,
        primaryIngredient: sub.primaryIngredient,
        substitutes: sub.substitutes,
        substitutionScore: sub.substitutionScore,
      });
    }

    console.log(`✅ Loaded ${substitutions.length} substitutions into cache`);
  }
}
