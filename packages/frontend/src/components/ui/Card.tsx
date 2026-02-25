import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-card text-card-foreground border border-border',
          {
            'shadow-none': variant === 'default',
            'shadow-lg shadow-primary-500/10': variant === 'elevated',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
