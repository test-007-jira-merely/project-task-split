export interface IIngredientUtils {
  /**
   * Normalize an ingredient string (lowercase, trim, remove extra spaces)
   */
  normalizeIngredient(ingredient: string): string;

  /**
   * Normalize an array of ingredients and remove duplicates
   */
  normalizeIngredients(ingredients: string[]): string[];

  /**
   * Check if two ingredients match (normalized comparison)
   */
  ingredientsMatch(ingredient1: string, ingredient2: string): boolean;

  /**
   * Get ingredient suggestions based on partial input
   */
  getSuggestions(input: string, allIngredients: string[], limit?: number): string[];
}
