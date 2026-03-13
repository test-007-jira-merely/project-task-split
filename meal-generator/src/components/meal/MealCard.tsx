import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat } from 'lucide-react';
import { Meal } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/stores/useAppStore';
import { useToggleFavorite, useFavorites } from '@/hooks/useFavorites';

interface MealCardProps {
  meal: Meal;
  matchPercentage?: number;
  onClick?: () => void;
}

export function MealCard({ meal, matchPercentage, onClick }: MealCardProps) {
  const user = useAppStore((state) => state.user);
  const { data: favorites = [] } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const isFavorite = favorites.includes(meal.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleFavorite.mutate({ mealId: meal.id, isFavorite });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
    >
      <div className="relative h-48">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {matchPercentage !== undefined && (
          <div className="absolute top-3 left-3">
            <Badge variant={matchPercentage === 100 ? 'success' : 'warning'}>
              {matchPercentage}% Match
            </Badge>
          </div>
        )}
        {user && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {meal.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {meal.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge>{meal.category}</Badge>
          {meal.prepTime && (
            <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {meal.prepTime}m
            </span>
          )}
          {meal.difficulty && (
            <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <ChefHat className="w-4 h-4 mr-1" />
              {meal.difficulty}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
