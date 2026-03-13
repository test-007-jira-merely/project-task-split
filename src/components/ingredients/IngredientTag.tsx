import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export function IngredientTag({ ingredient, onRemove }: IngredientTagProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium"
    >
      <span className="capitalize">{ingredient}</span>
      <button
        onClick={onRemove}
        className="hover:bg-primary-200 dark:hover:bg-primary-900/40 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${ingredient}`}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
