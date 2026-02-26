import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="card animate-pulse space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="w-full h-48 bg-muted/20 rounded-lg" />
          <div className="space-y-2">
            <div className="h-6 bg-muted/20 rounded w-3/4" />
            <div className="h-4 bg-muted/20 rounded w-full" />
            <div className="h-4 bg-muted/20 rounded w-2/3" />
          </div>
        </motion.div>
      ))}
    </>
  );
}
