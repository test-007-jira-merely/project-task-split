import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl mb-2 w-3/4" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl mb-2" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl w-5/6" />
    </div>
  );
}

export function MealCardSkeleton() {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-5/6" />
      </div>
    </motion.div>
  );
}
