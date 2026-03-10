/**
 * Type definitions for utility interfaces
 */

import { Meal, MealMatch } from '../types';

/**
 * Ingredient matcher interface for matching user ingredients with meals
 */
export interface IngredientMatcher {
  matchIngredients(userIngredients: string[], meal: Meal): MealMatch;
  calculateMatchPercentage(matchedCount: number, totalCount: number): number;
  findMatchedIngredients(userIngredients: string[], mealIngredients: string[]): string[];
  findMissingIngredients(userIngredients: string[], mealIngredients: string[]): string[];
}

/**
 * String normalizer interface for standardizing ingredient names
 */
export interface StringNormalizer {
  normalize(input: string): string;
  normalizeArray(inputs: string[]): string[];
  removeExtraSpaces(input: string): string;
  toLowerCase(input: string): string;
  removePunctuation(input: string): string;
}
