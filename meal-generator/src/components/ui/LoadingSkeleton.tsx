import { motion } from 'framer-motion';

export function LoadingSkeleton({ count = 1, className = '' }: { count?: number; className?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`bg-neutral-200 dark:bg-neutral-700 rounded-2xl ${className}`}
        />
      ))}
    </>
  );
}
