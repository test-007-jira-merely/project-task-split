import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '@types/meal';
import { Card } from '@components/ui/Card';
import { useFavorites } from '@hooks/useFavorites';
import { useAuth } from '@hooks/useAuth';

interface MealCardProps {
  meal: Meal;
  onClick?: () => void;
  matchPercentage?: number;
}

export function MealCard({ meal, onClick, matchPercentage }: MealCardProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(meal.id);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return;

    if (favorite) {
      await removeFavorite(meal.id);
    } else {
      await addFavorite(meal.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer h-full flex flex-col" onClick={onClick}>
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteToggle}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm"
            >
              <Heart
                className={`w-5 h-5 ${
                  favorite ? 'fill-red-500 text-red-500' : 'text-neutral-600 dark:text-neutral-400'
                }`}
              />
            </motion.button>
          )}
          {matchPercentage !== undefined && (
            <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-sm font-medium">
              {matchPercentage}% Match
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{meal.name}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2 flex-1">
            {meal.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
            <span className="flex items-center gap-1 capitalize">
              <ChefHat className="w-4 h-4" />
              {meal.category}
            </span>
            {meal.prepTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {meal.prepTime} min
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
