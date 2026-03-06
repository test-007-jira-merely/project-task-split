import { Meal } from '../types';
import { ReactNode } from 'react';

// UI Component Props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
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
  onFavorite?: (mealId: string) => void;
  onViewDetails?: (meal: Meal) => void;
  isFavorite?: boolean;
  matchPercentage?: number;
  showActions?: boolean;
}

export interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: (mealId: string) => void;
  isFavorite?: boolean;
}

export interface MatchIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

// Ingredient Component Props
export interface IngredientInputProps {
  value: string[];
  onChange: (ingredients: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export interface IngredientTagProps {
  ingredient: string;
  onRemove: (ingredient: string) => void;
}

export interface IngredientSuggestionsProps {
  suggestions: string[];
  onSelect: (ingredient: string) => void;
  searchTerm: string;
}

// Layout Component Props
export interface AppLayoutProps {
  children: ReactNode;
}

export interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

export interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

// Admin Component Props
export interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (meal: Omit<Meal, 'id'> | Meal) => Promise<void>;
  onCancel: () => void;
}

export interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (mealId: string) => void;
}

// Feature Component Props
export interface FavoritesGridProps {
  meals: Meal[];
  favorites: string[];
  onRemoveFavorite: (mealId: string) => void;
  onViewDetails: (meal: Meal) => void;
}

export interface HistoryListProps {
  meals: Meal[];
  onViewDetails: (meal: Meal) => void;
}

// Utility Component Props
export interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text';
  count?: number;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

export interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade' | 'slide' | 'scale';
  delay?: number;
}
