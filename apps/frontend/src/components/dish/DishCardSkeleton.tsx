import { motion } from 'framer-motion';

export function DishCardSkeleton() {
  return (
    <motion.div
      className="card animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image skeleton */}
      <div className="w-full h-64 bg-muted/20 rounded-lg mb-4" />

      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-muted/20 rounded w-3/4" />
        <div className="h-4 bg-muted/20 rounded w-full" />
        <div className="h-4 bg-muted/20 rounded w-2/3" />

        {/* Meta info skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-4 bg-muted/20 rounded w-16" />
          <div className="h-4 bg-muted/20 rounded w-16" />
          <div className="h-4 bg-muted/20 rounded w-16" />
        </div>

        {/* Ingredients skeleton */}
        <div className="pt-2 border-t border-border">
          <div className="h-3 bg-muted/20 rounded w-full" />
        </div>
      </div>
    </motion.div>
  );
}
