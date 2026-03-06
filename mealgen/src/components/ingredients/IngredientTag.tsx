import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { IngredientTagProps } from '@/types/components';

export function IngredientTag({ ingredient, onRemove }: IngredientTagProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm font-medium"
    >
      <span>{ingredient}</span>
      <button
        onClick={onRemove}
        className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5 transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
