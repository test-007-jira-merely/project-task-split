import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import { useAddFavorite, useRemoveFavorite } from '../../hooks';
import { Badge } from '../ui';

interface MealCardProps {
  meal: Meal;
  matchPercentage?: number;
  onClick?: () => void;
}

export function MealCard({ meal, matchPercentage, onClick }: MealCardProps) {
  const user = useAppStore(state => state.user);
  const favorites = useAppStore(state => state.favorites);
  const isFavorite = favorites.includes(meal.id);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    if (isFavorite) {
      removeFavorite.mutate(meal.id);
    } else {
      addFavorite.mutate(meal.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {matchPercentage !== undefined && (
          <div className="absolute top-3 left-3">
            <Badge variant={matchPercentage === 100 ? 'success' : matchPercentage >= 70 ? 'warning' : 'secondary'}>
              {matchPercentage}% Match
            </Badge>
          </div>
        )}
        {user && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-dark-800/90 rounded-full hover:scale-110 transition-transform"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
            />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {meal.name}
          </h3>
          <Badge variant="secondary">{meal.category}</Badge>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {meal.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          {meal.difficulty && (
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span className="capitalize">{meal.difficulty}</span>
            </div>
          )}
          {meal.prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{meal.prepTime} min</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
