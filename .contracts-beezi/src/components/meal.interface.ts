// Interface for meal-specific components

import { Meal, IngredientMatch } from '../types';

export interface MealCardProps {
  meal: Meal;
  onView?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  showMatchIndicator?: boolean;
  matchPercentage?: number;
  className?: string;
}

export interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export interface MatchIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  mealCounts?: Record<string, number>;
}

export interface MealListProps {
  meals: Meal[] | IngredientMatch[];
  isLoading?: boolean;
  emptyMessage?: string;
  onMealClick?: (meal: Meal) => void;
  showMatchIndicator?: boolean;
}
