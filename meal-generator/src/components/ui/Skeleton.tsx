import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string;
  height?: string;
}

export const Skeleton = ({ variant = 'rectangular', width, height, className = '', ...props }: SkeletonProps) => {
  const variants = {
    text: 'h-4 rounded',
    rectangular: 'rounded-2xl',
    circular: 'rounded-full',
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${variants[variant]} ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
};
