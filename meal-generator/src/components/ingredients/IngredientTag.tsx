import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export function IngredientTag({ ingredient, onRemove }: IngredientTagProps) {
  return (
    <motion.span
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {ingredient}
      <button
        onClick={onRemove}
        className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${ingredient}`}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.span>
  );
}
