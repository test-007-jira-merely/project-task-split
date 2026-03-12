// Application constants and configuration

export const APP_NAME = 'MealGen';

export const ROUTES = {
  HOME: '/',
  INGREDIENTS: '/ingredients',
  FAVORITES: '/favorites',
  HISTORY: '/history',
  ADMIN: '/admin',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const THEME_STORAGE_KEY = 'mealgen-theme';
export const AUTH_STORAGE_KEY = 'mealgen-auth';

export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const QUERY_KEYS = {
  meals: 'meals',
  meal: 'meal',
  favorites: 'favorites',
  history: 'history',
  user: 'user',
} as const;

export const TOAST_MESSAGES = {
  MEAL_GENERATED: 'New meal generated!',
  FAVORITE_ADDED: 'Added to favorites',
  FAVORITE_REMOVED: 'Removed from favorites',
  MEAL_CREATED: 'Meal created successfully',
  MEAL_UPDATED: 'Meal updated successfully',
  MEAL_DELETED: 'Meal deleted successfully',
  IMPORT_SUCCESS: 'Meals imported successfully',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
} as const;
