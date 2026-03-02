import { motion } from 'framer-motion';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export const IngredientTag = ({ ingredient, onRemove }: IngredientTagProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="inline-flex items-center space-x-2 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark px-3 py-1.5 rounded-full text-sm font-medium"
    >
      <span>{ingredient}</span>
      <motion.button
        onClick={onRemove}
        className="hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 rounded-full p-0.5 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Remove ${ingredient}`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};
