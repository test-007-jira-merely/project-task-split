import { SkeletonProps } from '../../types/ui.interface';

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
}: SkeletonProps) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};
