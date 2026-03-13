interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export const Skeleton = ({ className = '', variant = 'rectangular' }: SkeletonProps) => {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }

  return (
    <div
      className={`
        animate-pulse bg-gray-200 dark:bg-gray-700
        ${variantClasses[variant]}
        ${className}
      `}
    />
  )
}

export const MealCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <Skeleton className="w-full h-64 mb-4" />
      <Skeleton className="w-3/4 h-6 mb-3" variant="text" />
      <Skeleton className="w-full h-4 mb-2" variant="text" />
      <Skeleton className="w-5/6 h-4 mb-4" variant="text" />
      <div className="flex gap-2">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-24 h-8" />
      </div>
    </div>
  )
}
