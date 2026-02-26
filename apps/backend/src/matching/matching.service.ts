import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SUBSTITUTION_GROUPS } from '@meal-platform/shared';

export interface MatchResult {
  dish: any;
  matchScore: number;
  coverage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  substitutedIngredients: Array<{
    original: string;
    substitute: string;
    confidence: number;
  }>;
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Find dishes that match given ingredients with intelligent scoring
   */
  async findMatchingDishes(
    userIngredients: string[],
    allowSubstitutes: boolean = true,
    maxResults: number = 10,
  ): Promise<MatchResult[]> {
    this.logger.log(`Finding matches for: ${userIngredients.join(', ')}`);

    // Normalize user ingredients
    const normalizedUserIngredients = userIngredients.map((ing) =>
      this.normalizeIngredient(ing),
    );

    // Fetch all dishes with ingredients
    const dishes = await this.prisma.dish.findMany({
      include: {
        ingredients: true,
      },
    });

    // Score each dish
    const results: MatchResult[] = [];

    for (const dish of dishes) {
      const matchResult = this.scoreDish(
        dish,
        normalizedUserIngredients,
        allowSubstitutes,
      );

      if (matchResult.matchScore > 0) {
        results.push(matchResult);
      }
    }

    // Sort by match score (descending) and return top results
    return results
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxResults);
  }

  /**
   * Score a single dish against user ingredients
   */
  private scoreDish(
    dish: any,
    userIngredients: string[],
    allowSubstitutes: boolean,
  ): MatchResult {
    const dishIngredients = dish.ingredients.map((ing: any) =>
      this.normalizeIngredient(ing.name),
    );

    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];
    const substitutedIngredients: Array<{
      original: string;
      substitute: string;
      confidence: number;
    }> = [];

    let totalMatches = 0;
    let exactMatches = 0;
    let substituteMatches = 0;

    // Check each dish ingredient
    for (const dishIng of dishIngredients) {
      let matched = false;

      // Try exact match first
      if (userIngredients.includes(dishIng)) {
        matchedIngredients.push(dishIng);
        exactMatches++;
        totalMatches++;
        matched = true;
        continue;
      }

      // Try fuzzy match
      if (this.fuzzyMatch(dishIng, userIngredients)) {
        matchedIngredients.push(dishIng);
        exactMatches++;
        totalMatches++;
        matched = true;
        continue;
      }

      // Try substitution match
      if (allowSubstitutes) {
        const substitution = this.findSubstitution(dishIng, userIngredients);
        if (substitution) {
          substitutedIngredients.push({
            original: dishIng,
            substitute: substitution.substitute,
            confidence: substitution.confidence,
          });
          substituteMatches++;
          totalMatches++;
          matched = true;
          continue;
        }
      }

      // No match found
      if (!matched) {
        missingIngredients.push(dishIng);
      }
    }

    // Calculate scores
    const coverage =
      dishIngredients.length > 0
        ? (totalMatches / dishIngredients.length) * 100
        : 0;

    // Weighted match score
    // Exact matches are worth more than substitute matches
    const exactWeight = 1.0;
    const substituteWeight = 0.7;

    const weightedScore =
      exactMatches * exactWeight + substituteMatches * substituteWeight;

    const maxPossibleScore = dishIngredients.length * exactWeight;
    const matchScore =
      maxPossibleScore > 0 ? (weightedScore / maxPossibleScore) * 100 : 0;

    return {
      dish: {
        ...dish,
        ingredients: dish.ingredients.map((ing: any) => ({
          id: ing.id,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          substitutes: ing.substitutes,
        })),
      },
      matchScore: Math.round(matchScore * 100) / 100,
      coverage: Math.round(coverage * 100) / 100,
      matchedIngredients,
      missingIngredients,
      substitutedIngredients,
    };
  }

  /**
   * Normalize ingredient name for consistent matching
   */
  private normalizeIngredient(ingredient: string): string {
    return ingredient
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s-]/g, '');
  }

  /**
   * Fuzzy matching with similarity threshold
   */
  private fuzzyMatch(
    dishIngredient: string,
    userIngredients: string[],
  ): boolean {
    for (const userIng of userIngredients) {
      // Check if one contains the other
      if (
        dishIngredient.includes(userIng) ||
        userIng.includes(dishIngredient)
      ) {
        return true;
      }

      // Check Levenshtein distance for typos
      if (this.levenshteinDistance(dishIngredient, userIng) <= 2) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find substitution match in user ingredients
   */
  private findSubstitution(
    dishIngredient: string,
    userIngredients: string[],
  ): { substitute: string; confidence: number } | null {
    for (const [groupName, group] of Object.entries(SUBSTITUTION_GROUPS)) {
      const normalizedItems = group.items.map((item) =>
        this.normalizeIngredient(item),
      );

      // Check if dish ingredient is in this substitution group
      if (normalizedItems.includes(dishIngredient)) {
        // Check if user has any item from the same group
        for (const userIng of userIngredients) {
          if (normalizedItems.includes(userIng) && userIng !== dishIngredient) {
            return {
              substitute: userIng,
              confidence: group.confidence,
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Calculate Levenshtein distance between two strings
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
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}
