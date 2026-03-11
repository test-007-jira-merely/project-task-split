import { Meal, MealMatchResult, MealFilterCriteria } from "./domain/meal_types";

export type ThemeMode = "light" | "dark" | "system";

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
  isAdmin?: boolean;
}

export interface AppState {
  user: UserProfile | null;
  theme: ThemeMode;
  currentMeal: Meal | null;
  ingredients: string[];
  filteredMeals: MealMatchResult[];
  favorites: Meal[];
  history: Meal[];
  filterCriteria: MealFilterCriteria;
  loading: {
    auth: boolean;
    data: boolean;
    mutations: Record<string, boolean>;
  };
}

export interface AppActions {
  setUser(user: UserProfile | null): void;
  setTheme(theme: ThemeMode): void;
  setCurrentMeal(meal: Meal | null): void;
  addIngredient(ingredient: string): void;
  removeIngredient(ingredient: string): void;
  setFilteredMeals(results: MealMatchResult[]): void;
  setFavorites(meals: Meal[]): void;
  setHistory(meals: Meal[]): void;
  setFilterCriteria(criteria: Partial<MealFilterCriteria>): void;
  setLoading(key: keyof AppState["loading"], value: boolean): void;
}

export interface AppStore extends AppState, AppActions {}
