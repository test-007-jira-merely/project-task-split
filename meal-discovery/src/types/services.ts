import { AuthCredentials, User, Session, Meal, Favorite, UserHistory } from '../types';

// Authentication Service Interface
export interface IAuthService {
  signUp(credentials: AuthCredentials): Promise<{ user: User; session: Session }>;
  signIn(credentials: AuthCredentials): Promise<{ user: User; session: Session }>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<Session | null>;
}

// Meal Service Interface
export interface IMealService {
  getAllMeals(): Promise<Meal[]>;
  getMealById(id: string): Promise<Meal | null>;
  createMeal(meal: Omit<Meal, 'id'>): Promise<Meal>;
  updateMeal(id: string, meal: Partial<Meal>): Promise<Meal>;
  deleteMeal(id: string): Promise<void>;
  importMeals(meals: Meal[]): Promise<void>;
}

// Favorites Service Interface
export interface IFavoritesService {
  getUserFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(userId: string, mealId: string): Promise<Favorite>;
  removeFavorite(userId: string, mealId: string): Promise<void>;
}

// History Service Interface
export interface IHistoryService {
  getUserHistory(userId: string): Promise<UserHistory[]>;
  addToHistory(userId: string, mealId: string): Promise<UserHistory>;
}

// Matching Engine Interface
export interface IMatchingEngine {
  calculateMatchPercentage(mealIngredients: string[], availableIngredients: string[]): number;
  filterMealsByIngredients(meals: Meal[], ingredients: string[]): Array<{ meal: Meal; matchPercentage: number }>;
  normalizeString(input: string): string;
  extractUniqueIngredients(meals: Meal[]): string[];
}
