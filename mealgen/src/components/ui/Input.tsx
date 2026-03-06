import { forwardRef } from 'react';
import type { InputProps } from '@/types/components';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      type = 'text',
      error,
      label,
      disabled = false,
      className = '',
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2 rounded-xl
            bg-white dark:bg-gray-800
            border-2 transition-colors
            ${error
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
            }
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-orange-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
