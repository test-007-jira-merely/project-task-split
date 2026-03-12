import { forwardRef } from 'react';

interface InputProps {
  value?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, placeholder, type = 'text', error, label, disabled = false, className = '', ...rest }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 rounded-2xl border ${
            error ? 'border-destructive' : 'border-input'
          } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          {...rest}
        />
        {error && (
          <p className="mt-1.5 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
