import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-gray-200 shadow-sm',
          'bg-white',
          glass && 'backdrop-blur-lg bg-white/80',
          'dark:border-gray-800 dark:bg-gray-900',
          glass && 'dark:bg-gray-900/80',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
