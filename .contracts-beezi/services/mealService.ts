import { Meal, MealCategory, MealFilter, MealWithMatch } from '../types/meal';

export interface IMealService {
  /**
   * Load all meals from local JSON dataset
   */
  loadMeals(): Promise<Meal[]>;

  /**
   * Get a single meal by ID
   */
  getMealById(id: string, meals: Meal[]): Meal | undefined;

  /**
   * Get a random meal, optionally excluding a specific ID
   */
  getRandomMeal(meals: Meal[], excludeId?: string): Meal;

  /**
   * Filter meals by various criteria
   */
  filterMeals(meals: Meal[], filter: MealFilter): Meal[];

  /**
   * Calculate ingredient match percentage for a meal
   */
  calculateMatchPercentage(mealIngredients: string[], userIngredients: string[]): number;

  /**
   * Find meals matching user ingredients with match percentage
   */
  findMealsByIngredients(meals: Meal[], userIngredients: string[]): MealWithMatch[];

  /**
   * Get all unique ingredients from meals dataset
   */
  getAllIngredients(meals: Meal[]): string[];

  /**
   * Get meals by category
   */
  getMealsByCategory(meals: Meal[], category: MealCategory): Meal[];
}
