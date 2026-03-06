import { LoadingSkeletonProps } from '@/types/components';

export const LoadingSkeleton = ({ type = 'card', count = 1 }: LoadingSkeletonProps) => {
  const CardSkeleton = () => (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6 animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4" />
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-card rounded-xl border border-border p-4 animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  );

  const TextSkeleton = () => (
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
  );

  const Component = type === 'card' ? CardSkeleton : type === 'list' ? ListSkeleton : TextSkeleton;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
};
