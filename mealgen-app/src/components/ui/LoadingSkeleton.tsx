interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'image' | 'circular';
  width?: string;
  height?: string;
  className?: string;
}

export default function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  className = ''
}: LoadingSkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantStyles = {
    text: 'h-4 rounded',
    card: 'h-64 rounded-xl',
    image: 'h-48 rounded-lg',
    circular: 'rounded-full',
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}
