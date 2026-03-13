import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, glass, className = '', ...props }, ref) => {
    const baseStyles = 'card p-6';
    const glassStyles = glass ? 'glass' : 'bg-white dark:bg-gray-900';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${glassStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
