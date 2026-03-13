export const LoadingSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl ${className}`} />
  );
};

export const MealCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-glass dark:shadow-glass-dark p-6 space-y-4">
      <LoadingSkeleton className="h-64 w-full" />
      <LoadingSkeleton className="h-8 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-6 w-20" />
        <LoadingSkeleton className="h-6 w-24" />
        <LoadingSkeleton className="h-6 w-16" />
      </div>
    </div>
  );
};
