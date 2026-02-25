import { Injectable } from '@nestjs/common';
import { Dish, MatchScore } from '@meal-platform/shared';
import { SubstitutionMatrixService } from './substitution-matrix.service';

export interface NormalizedToken {
  original: string;
  normalized: string;
  synonyms: string[];
}

@Injectable()
export class MatchingAlgorithmService {
  constructor(private readonly substitutionMatrix: SubstitutionMatrixService) {}

  /**
   * Normalizes ingredient text for matching
   */
  normalizeIngredient(ingredient: string): NormalizedToken {
    const original = ingredient;
    let normalized = ingredient.toLowerCase().trim();

    // Remove special characters
    normalized = normalized.replace(/[^\w\s]/g, '');

    // Handle common plurals
    const singularized = this.singularize(normalized);

    // Get synonyms
    const synonyms = this.getSynonyms(singularized);

    return {
      original,
      normalized: singularized,
      synonyms
    };
  }

  private singularize(word: string): string {
    // Simple pluralization handling
    const pluralRules = [
      { pattern: /ies$/, replacement: 'y' },      // berries -> berry
      { pattern: /ves$/, replacement: 'fe' },     // knives -> knife
      { pattern: /oes$/, replacement: 'o' },      // tomatoes -> tomato
      { pattern: /ses$/, replacement: 's' },      // glasses -> glass
      { pattern: /sses$/, replacement: 'ss' },    //asses -> ass
      { pattern: /s$/, replacement: '' },         // cats -> cat
    ];

    for (const rule of pluralRules) {
      if (rule.pattern.test(word)) {
        return word.replace(rule.pattern, rule.replacement);
      }
    }

    return word;
  }

  private getSynonyms(ingredient: string): string[] {
    const synonymMap: Record<string, string[]> = {
      'tomato': ['tomatoes', 'cherry tomato', 'cherry tomatoes'],
      'onion': ['onions', 'yellow onion', 'white onion', 'red onion'],
      'chicken': ['chicken breast', 'chicken thigh', 'chicken leg'],
      'carrot': ['carrots'],
      'potato': ['potatoes'],
      'egg': ['eggs'],
      'garlic': ['garlic clove', 'garlic cloves'],
      'lemon': ['lemon juice'],
      'lime': ['lime juice'],
      'cilantro': ['coriander'],
      'bell pepper': ['red bell pepper', 'green bell pepper', 'yellow bell pepper', 'pepper'],
    };

    return synonymMap[ingredient] || [];
  }

  /**
   * Computes Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[len1][len2];
  }

  /**
   * Computes fuzzy match score between two ingredient strings
   */
  fuzzyMatch(ingredient1: string, ingredient2: string): number {
    const norm1 = ingredient1.toLowerCase().trim();
    const norm2 = ingredient2.toLowerCase().trim();

    // Exact match
    if (norm1 === norm2) return 1.0;

    // Check if one contains the other
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
      const longer = Math.max(norm1.length, norm2.length);
      const shorter = Math.min(norm1.length, norm2.length);
      return shorter / longer;
    }

    // Levenshtein distance
    const distance = this.levenshteinDistance(norm1, norm2);
    const maxLen = Math.max(norm1.length, norm2.length);

    if (maxLen === 0) return 1.0;

    return 1 - (distance / maxLen);
  }

  /**
   * Finds matching dishes based on provided ingredients
   */
  findMatches(
    userIngredients: string[],
    allDishes: Dish[],
    options: {
      exactMatchOnly?: boolean;
      allowSubstitutions?: boolean;
      minCoverage?: number;
      fuzzyThreshold?: number;
    }
  ): MatchScore[] {
    const {
      exactMatchOnly = false,
      allowSubstitutions = true,
      minCoverage = 0,
      fuzzyThreshold = 0.8
    } = options;

    const matches: MatchScore[] = [];

    for (const dish of allDishes) {
      const score = this.computeDishScore(
        userIngredients,
        dish,
        allowSubstitutions,
        exactMatchOnly,
        fuzzyThreshold
      );

      if (score.coveragePercentage >= minCoverage) {
        matches.push(score);
      }
    }

    return this.rankMatches(matches);
  }

  /**
   * Computes match score for a single dish
   */
  computeDishScore(
    userIngredients: string[],
    dish: Dish,
    allowSubstitutions: boolean,
    exactMatchOnly: boolean = false,
    fuzzyThreshold: number = 0.8
  ): MatchScore {
    const normalizedUserIngredients = userIngredients.map(ing =>
      this.normalizeIngredient(ing)
    );

    const dishIngredients = dish.ingredients.map(ing => ing.name.toLowerCase());
    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];
    const substitutionMatches: Array<{
      requested: string;
      matched: string;
      confidence: number;
    }> = [];

    let totalConfidence = 0;
    let matchCount = 0;

    // Check each dish ingredient
    for (const dishIng of dish.ingredients) {
      const dishIngNorm = this.normalizeIngredient(dishIng.name);
      let matched = false;
      let bestConfidence = 0;
      let bestMatchedUserIng = '';

      // Try to match with user ingredients
      for (const userIng of normalizedUserIngredients) {
        // Exact match
        if (dishIngNorm.normalized === userIng.normalized) {
          matched = true;
          bestConfidence = 1.0;
          bestMatchedUserIng = userIng.original;
          break;
        }

        // Synonym match
        if (dishIngNorm.synonyms.some(syn =>
          syn.toLowerCase() === userIng.normalized
        )) {
          matched = true;
          bestConfidence = 0.95;
          bestMatchedUserIng = userIng.original;
          break;
        }

        // Fuzzy match
        if (!exactMatchOnly) {
          const fuzzyScore = this.fuzzyMatch(dishIngNorm.normalized, userIng.normalized);
          if (fuzzyScore >= fuzzyThreshold && fuzzyScore > bestConfidence) {
            matched = true;
            bestConfidence = fuzzyScore;
            bestMatchedUserIng = userIng.original;
          }
        }

        // Substitution match
        if (allowSubstitutions && !matched) {
          const confidence = this.substitutionMatrix.getConfidence(
            dishIngNorm.normalized,
            userIng.normalized
          );
          if (confidence > 0 && confidence > bestConfidence) {
            matched = true;
            bestConfidence = confidence;
            bestMatchedUserIng = userIng.original;

            substitutionMatches.push({
              requested: userIng.original,
              matched: dishIng.name,
              confidence
            });
          }

          // Reverse substitution
          const reverseConfidence = this.substitutionMatrix.getConfidence(
            userIng.normalized,
            dishIngNorm.normalized
          );
          if (reverseConfidence > 0 && reverseConfidence > bestConfidence) {
            matched = true;
            bestConfidence = reverseConfidence;
            bestMatchedUserIng = userIng.original;

            substitutionMatches.push({
              requested: userIng.original,
              matched: dishIng.name,
              confidence: reverseConfidence
            });
          }
        }
      }

      if (matched) {
        matchedIngredients.push(dishIng.name);
        totalConfidence += bestConfidence;
        matchCount++;
      } else {
        missingIngredients.push(dishIng.name);
      }
    }

    const totalRequired = dish.ingredients.length;
    const coveragePercentage = totalRequired > 0
      ? (matchCount / totalRequired) * 100
      : 0;

    const avgConfidence = matchCount > 0 ? totalConfidence / matchCount : 0;
    const score = coveragePercentage * avgConfidence;

    return {
      dishId: dish.id,
      score: Math.round(score * 100) / 100,
      matchedIngredients,
      missingIngredients,
      substitutionMatches,
      coveragePercentage: Math.round(coveragePercentage * 100) / 100
    };
  }

  /**
   * Ranks and sorts match results by score
   */
  rankMatches(matches: MatchScore[]): MatchScore[] {
    return matches.sort((a, b) => {
      // Primary sort by score
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // Secondary sort by coverage percentage
      if (b.coveragePercentage !== a.coveragePercentage) {
        return b.coveragePercentage - a.coveragePercentage;
      }

      // Tertiary sort by fewer missing ingredients
      return a.missingIngredients.length - b.missingIngredients.length;
    });
  }
}
