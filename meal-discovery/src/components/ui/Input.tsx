import { InputProps } from '@/types/components';

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
