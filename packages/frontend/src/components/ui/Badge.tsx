import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          {
            'bg-muted text-muted-foreground': variant === 'default',
            'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300': variant === 'primary',
            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': variant === 'success',
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': variant === 'warning',
            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': variant === 'danger',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
