import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:opacity-50 disabled:pointer-events-none',
          'active:scale-95',
          {
            'bg-card hover:bg-muted text-foreground border border-border': variant === 'default',
            'bg-primary-500 hover:bg-primary-600 text-white': variant === 'primary',
            'bg-card-foreground hover:bg-muted-foreground text-card': variant === 'secondary',
            'hover:bg-muted text-foreground': variant === 'ghost',
            'bg-red-500 hover:bg-red-600 text-white': variant === 'danger',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
