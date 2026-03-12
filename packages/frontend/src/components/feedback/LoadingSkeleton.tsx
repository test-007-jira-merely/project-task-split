interface LoadingSkeletonProps {
  variant: 'card' | 'list' | 'text' | 'image';
  count?: number;
}

export function LoadingSkeleton({ variant, count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="aspect-video bg-muted animate-shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded animate-shimmer w-3/4" />
              <div className="h-4 bg-muted rounded animate-shimmer w-full" />
              <div className="h-4 bg-muted rounded animate-shimmer w-5/6" />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <div className="w-12 h-12 bg-muted rounded-full animate-shimmer flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-shimmer w-3/4" />
              <div className="h-3 bg-muted rounded animate-shimmer w-1/2" />
            </div>
          </div>
        );
      case 'text':
        return <div className="h-4 bg-muted rounded animate-shimmer" />;
      case 'image':
        return <div className="aspect-video bg-muted rounded-lg animate-shimmer" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
