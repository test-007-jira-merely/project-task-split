import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export const IngredientTag = ({ ingredient, onRemove }: IngredientTagProps) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
    >
      {ingredient}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-primary-200 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${ingredient}`}
      >
        <X size={14} />
      </button>
    </motion.span>
  );
};
