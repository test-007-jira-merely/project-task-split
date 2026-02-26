import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface FavoriteButtonProps {
  dishId: string;
  isFavorite?: boolean;
  onToggle?: () => void;
}

export function FavoriteButton({ dishId: _dishId, isFavorite = false, onToggle }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(isFavorite);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorited(!favorited);
    onToggle?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        animate={favorited ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            favorited ? 'fill-accent text-accent' : 'text-muted'
          }`}
        />
      </motion.div>
    </motion.button>
  );
}
