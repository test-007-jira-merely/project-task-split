import { memo } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

const IngredientTag = memo(function IngredientTag({ ingredient, onRemove }: IngredientTagProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium"
    >
      <span>{ingredient}</span>
      <button
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
        aria-label={`Remove ${ingredient}`}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
});

export default IngredientTag;
