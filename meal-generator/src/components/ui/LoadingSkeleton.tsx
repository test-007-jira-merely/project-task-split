export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-dark-700 rounded-xl ${className}`} />
  );
}

export function MealCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <LoadingSkeleton className="h-48 w-full" />
      <LoadingSkeleton className="h-6 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-5/6" />
    </div>
  );
}
