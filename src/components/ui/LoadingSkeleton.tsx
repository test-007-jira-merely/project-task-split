import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`bg-muted rounded-xl ${className}`}
    />
  );
}

export function MealCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
      <LoadingSkeleton className="w-full h-64 mb-4" />
      <LoadingSkeleton className="w-3/4 h-8 mb-2" />
      <LoadingSkeleton className="w-full h-4 mb-2" />
      <LoadingSkeleton className="w-5/6 h-4" />
    </div>
  );
}
