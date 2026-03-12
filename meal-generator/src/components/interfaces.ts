// Component prop interfaces

import type { ReactNode } from 'react';
import type { Meal, MealCategory, IngredientMatch } from '../types';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export interface MealCardProps {
  meal: Meal;
  showMatchIndicator?: boolean;
  matchPercentage?: number;
  onFavorite?: (mealId: string) => void;
  isFavorite?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: (mealId: string) => void;
  isFavorite?: boolean;
}

export interface IngredientInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddIngredient: (ingredient: string) => void;
  suggestions: string[];
  placeholder?: string;
}

export interface IngredientTagProps {
  ingredient: string;
  onRemove: (ingredient: string) => void;
}

export interface MatchIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface CategoryFilterProps {
  selectedCategory?: MealCategory;
  onCategoryChange: (category: MealCategory | undefined) => void;
}

export interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (meal: Partial<Meal>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface FilteredMealListProps {
  matches: IngredientMatch[];
  isLoading?: boolean;
  onMealClick?: (meal: Meal) => void;
}
