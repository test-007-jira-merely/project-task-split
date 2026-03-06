import { IngredientTagProps } from '@/types/components';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export const IngredientTag = ({ ingredient, onRemove }: IngredientTagProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
    >
      <span>{ingredient}</span>
      <button
        onClick={() => onRemove(ingredient)}
        className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
};
