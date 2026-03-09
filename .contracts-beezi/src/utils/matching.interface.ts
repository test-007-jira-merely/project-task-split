// Interface for ingredient matching utilities

export interface IMatchingUtils {
  /**
   * Normalize a string for comparison (lowercase, trim, remove special chars)
   */
  normalizeString(str: string): string;

  /**
   * Calculate match percentage between available ingredients and required ingredients
   */
  calculateMatchPercentage(available: string[], required: string[]): number;

  /**
   * Find matched ingredients between two arrays
   */
  findMatchedIngredients(available: string[], required: string[]): string[];

  /**
   * Find missing ingredients from required list
   */
  findMissingIngredients(available: string[], required: string[]): string[];

  /**
   * Remove duplicate ingredients from array
   */
  removeDuplicates(ingredients: string[]): string[];
}
