import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export const IngredientTag = ({ ingredient, onRemove }: IngredientTagProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
    >
      <span className="font-medium">{ingredient}</span>
      <motion.button
        onClick={onRemove}
        className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-lg p-1 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};
