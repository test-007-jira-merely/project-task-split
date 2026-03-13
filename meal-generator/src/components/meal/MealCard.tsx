import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat } from 'lucide-react';
import { Meal } from '@/types/meal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface MealCardProps {
  meal: Meal;
  matchPercentage?: number;
  onFavorite?: () => void;
  isFavorited?: boolean;
  onView?: () => void;
}

export const MealCard = ({ meal, matchPercentage, onFavorite, isFavorited, onView }: MealCardProps) => {
  const categoryColors = {
    breakfast: 'warning',
    lunch: 'primary',
    dinner: 'success',
    snack: 'secondary',
  } as const;

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  } as const;

  return (
    <Card hover glass className="overflow-hidden cursor-pointer" onClick={onView}>
      <div className="relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-48 object-cover rounded-xl"
          loading="lazy"
        />
        {matchPercentage !== undefined && (
          <div className="absolute top-3 right-3">
            <Badge variant={matchPercentage === 100 ? 'success' : 'warning'}>
              {matchPercentage}% Match
            </Badge>
          </div>
        )}
        {onFavorite && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            className={`
              absolute top-3 left-3 p-2 rounded-xl
              ${isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400'
              }
              backdrop-blur-sm transition-colors
            `}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.button>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {meal.name}
          </h3>
          <Badge variant={categoryColors[meal.category]}>
            {meal.category}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {meal.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {meal.preparationTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{meal.preparationTime} min</span>
            </div>
          )}
          {meal.difficulty && (
            <Badge size="sm" variant={difficultyColors[meal.difficulty]}>
              {meal.difficulty}
            </Badge>
          )}
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{meal.ingredients.length} ingredients</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
