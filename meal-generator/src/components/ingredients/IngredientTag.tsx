import { motion } from 'framer-motion';
import { X } from 'lucide-react';

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
      whileHover={{ scale: 1.05 }}
      className="
        inline-flex items-center gap-2 px-3 py-1.5
        bg-primary-100 dark:bg-primary-900/30
        text-primary-700 dark:text-primary-300
        rounded-xl font-medium
      "
    >
      <span>{ingredient}</span>
      <button
        onClick={onRemove}
        className="hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${ingredient}`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
