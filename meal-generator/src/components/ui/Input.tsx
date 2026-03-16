import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900
            outline-none transition-all ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
