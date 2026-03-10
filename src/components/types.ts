/**
 * Type definitions for component props
 */

import { ReactNode } from 'react';
import { Meal, MealMatch, MealCategory, MealDifficulty } from '../types';

/**
 * Layout component props
 */
export interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

/**
 * MealCard component props
 */
export interface MealCardProps {
  meal: Meal;
  matchPercentage?: number;
  onClick?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (mealId: string) => void;
  showMatchIndicator?: boolean;
  className?: string;
}

/**
 * MealDetailsModal component props
 */
export interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  matchedIngredients?: string[];
  missingIngredients?: string[];
  matchPercentage?: number;
  isFavorite?: boolean;
  onFavoriteToggle?: (mealId: string) => void;
}

/**
 * IngredientInput component props
 */
export interface IngredientInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * IngredientTag component props
 */
export interface IngredientTagProps {
  ingredient: string;
  onRemove: (ingredient: string) => void;
  className?: string;
}

/**
 * MatchIndicator component props
 */
export interface MatchIndicatorProps {
  percentage: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

/**
 * CategoryFilter component props
 */
export interface CategoryFilterProps {
  selectedCategory: MealCategory | 'all';
  onCategoryChange: (category: MealCategory | 'all') => void;
  categories?: Array<MealCategory | 'all'>;
  className?: string;
}

/**
 * EmptyState component props
 */
export interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * LoadingSkeleton component props
 */
export interface LoadingSkeletonProps {
  count?: number;
  height?: string | number;
  width?: string | number;
  className?: string;
}

/**
 * AnimatedContainer component props
 */
export interface AnimatedContainerProps {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'scale';
  duration?: number;
  delay?: number;
  className?: string;
}
