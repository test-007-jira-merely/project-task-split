import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  animated?: boolean;
}

export function FavoriteButton({ isFavorite, onToggle, animated = true }: FavoriteButtonProps) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'p-2 rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        isFavorite
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
          : 'bg-card/80 backdrop-blur text-muted-foreground hover:text-red-600'
      )}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        initial={false}
        animate={animated && isFavorite ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <FiHeart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
      </motion.div>
    </motion.button>
  );
}
