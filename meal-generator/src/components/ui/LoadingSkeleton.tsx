export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl ${className}`} />
  );
}

export function MealCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6">
      <LoadingSkeleton className="w-full h-64 mb-4" />
      <LoadingSkeleton className="h-8 w-3/4 mb-2" />
      <LoadingSkeleton className="h-4 w-full mb-2" />
      <LoadingSkeleton className="h-4 w-5/6" />
    </div>
  );
}
