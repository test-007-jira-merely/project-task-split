import { motion } from 'framer-motion';

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        className="w-16 h-16 border-4 border-primary-light/30 dark:border-primary-dark/30 border-t-primary-light dark:border-t-primary-dark rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        className="mt-4 text-text-secondary-light dark:text-text-secondary-dark font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Finding your perfect meal...
      </motion.p>
    </div>
  );
};
