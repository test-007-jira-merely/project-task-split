import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface IngredientTagProps {
  ingredient: string;
  onRemove?: (ingredient: string) => void;
  variant?: 'default' | 'matched' | 'missing';
  removable?: boolean;
}

export function IngredientTag({ 
  ingredient, 
  onRemove, 
  variant = 'default', 
  removable = true 
}: IngredientTagProps) {
  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
        {
          'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300': variant === 'default',
          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': variant === 'matched',
          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': variant === 'missing',
        }
      )}
    >
      <span>{ingredient}</span>
      {removable && onRemove && (
        <button
          onClick={() => onRemove(ingredient)}
          className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${ingredient}`}
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
}
