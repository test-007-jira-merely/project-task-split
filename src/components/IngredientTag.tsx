import { motion } from 'framer-motion';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export default function IngredientTag({ ingredient, onRemove }: IngredientTagProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center space-x-2 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-medium"
    >
      <span className="capitalize">{ingredient}</span>
      <motion.button
        onClick={onRemove}
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-bold"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Remove ${ingredient}`}
      >
        ×
      </motion.button>
    </motion.div>
  );
}
