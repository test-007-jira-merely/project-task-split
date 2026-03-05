import { motion } from 'framer-motion';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export default function EmptyState({ message, icon = '🍽️' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>
      <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
        {message}
      </p>
    </motion.div>
  );
}
