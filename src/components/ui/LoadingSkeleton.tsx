import React from 'react';
import { cn } from '../../lib/utils';

type SkeletonType = 'card' | 'list' | 'table' | 'text';

interface LoadingSkeletonProps {
  type?: SkeletonType;
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'text',
  count = 1,
  className,
}) => {
  const skeletonTypes: Record<SkeletonType, string> = {
    card: 'h-48 w-full rounded-2xl',
    list: 'h-16 w-full rounded-lg',
    table: 'h-12 w-full rounded-md',
    text: 'h-4 w-full rounded',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-gray-200 dark:bg-gray-700',
            skeletonTypes[type],
            className
          )}
        />
      ))}
    </>
  );
};

export default LoadingSkeleton;
