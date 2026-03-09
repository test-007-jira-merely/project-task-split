import { ReactNode } from 'react';
import { Meal, MealCategory } from '../types/meal';

// UI Component Props
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

// Meal Component Props
export interface MealCardProps {
  meal: Meal;
  matchPercentage?: number;
  onView?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  showActions?: boolean;
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
}

// Ingredient Component Props
export interface IngredientInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: (ingredient: string) => void;
  suggestions: string[];
  placeholder?: string;
}

export interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export interface IngredientSuggestionsProps {
  suggestions: string[];
  onSelect: (ingredient: string) => void;
  visible: boolean;
}

// Layout Component Props
export interface NavbarProps {
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export interface UserMenuProps {
  user: { email: string } | null;
  onLogout: () => void;
}

// Admin Component Props
export interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (meal: Omit<Meal, 'id'> | Meal) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (mealId: string) => void;
  isLoading?: boolean;
}

export interface CategoryFilterProps {
  selected: MealCategory | null;
  onChange: (category: MealCategory | null) => void;
}

// Utility Component Props
export interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'circle';
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

export interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}
