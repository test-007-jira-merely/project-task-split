export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`${sizeClasses[size]} border-gray-300 dark:border-dark-600 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin ${className}`}
    />
  );
}
