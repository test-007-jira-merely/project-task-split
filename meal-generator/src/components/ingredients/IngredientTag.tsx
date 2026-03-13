import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export function IngredientTag({ ingredient, onRemove }: IngredientTagProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-medium"
    >
      <span>{ingredient}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </motion.button>
    </motion.div>
  );
}
