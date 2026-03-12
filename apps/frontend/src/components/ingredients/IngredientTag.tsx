import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

export function IngredientTag({ ingredient, onRemove }: IngredientTagProps) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary/20 text-primary border border-primary/30"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      layout
    >
      <span className="text-sm font-medium capitalize">{ingredient}</span>
      <motion.button
        onClick={onRemove}
        className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
