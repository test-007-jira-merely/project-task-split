// Shared component prop interfaces

import type { Meal, IngredientMatch, MealCategory, Theme } from '../types';

// UI Component Props
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Meal Component Props
export interface MealCardProps {
  meal: Meal;
  onFavorite?: () => void;
  isFavorite?: boolean;
  matchPercentage?: number;
  onClick?: () => void;
  showActions?: boolean;
}

export interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
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

export interface MatchIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

// Filter Component Props
export interface CategoryFilterProps {
  selected?: MealCategory;
  onSelect: (category: MealCategory | undefined) => void;
}

// Layout Component Props
export interface NavbarProps {
  onToggleTheme: () => void;
  theme: Theme;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export interface UserMenuProps {
  user: { email: string; is_admin?: boolean } | null;
  onLogout: () => void;
}

// Admin Component Props
export interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (mealId: string) => void;
  loading?: boolean;
}

export interface AdminMealFormProps {
  meal?: Meal | null;
  onSubmit: (meal: Partial<Meal>) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Feature Component Props
export interface FavoritesGridProps {
  meals: Meal[];
  onRemove: (mealId: string) => void;
  onViewDetails: (meal: Meal) => void;
  loading?: boolean;
}

export interface HistoryListProps {
  meals: Meal[];
  onViewDetails: (meal: Meal) => void;
  loading?: boolean;
}

export interface MealResultsProps {
  matches: IngredientMatch[];
  onViewDetails: (meal: Meal) => void;
  onFavorite: (mealId: string) => void;
  favorites: string[];
  loading?: boolean;
}
