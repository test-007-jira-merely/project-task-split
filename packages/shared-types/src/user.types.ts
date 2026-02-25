export interface UserFavorite {
  id: string;
  dishId: string;
  userId: string;
  createdAt: Date;
}

export interface DishHistory {
  id: string;
  dishId: string;
  userId: string;
  viewedAt: Date;
  cooked?: boolean;
}

export interface UserPreferences {
  favoriteCategories: string[];
  dislikedIngredients: string[];
  dietaryRestrictions: string[];
}
