import type { LoadingSkeletonProps } from '@/types/components';

export function LoadingSkeleton({
  count = 1,
  height = 'h-20',
  className = '',
}: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${height} ${className} animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl`}
        />
      ))}
    </div>
  );
}
