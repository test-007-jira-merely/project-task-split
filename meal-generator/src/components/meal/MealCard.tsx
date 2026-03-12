import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '../../types/database';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../stores/useAppStore';

interface MealCardProps {
  meal: Meal;
  onView?: () => void;
  showMatchPercentage?: number;
}

export const MealCard = ({ meal, onView, showMatchPercentage }: MealCardProps) => {
  const { isFavorite } = useAppStore();
  const isLiked = isFavorite(meal.id);

  const categoryColors = {
    breakfast: 'warning',
    lunch: 'primary',
    dinner: 'success',
    snack: 'default',
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card hoverable onClick={onView} className="overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {showMatchPercentage !== undefined && (
            <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-xl px-3 py-1 shadow-lg">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {showMatchPercentage}% Match
              </span>
            </div>
          )}
          {isLiked && (
            <div className="absolute top-3 left-3">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
              {meal.name}
            </h3>
            <Badge variant={categoryColors[meal.category]} size="sm">
              {meal.category}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {meal.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span>{meal.ingredients.length} ingredients</span>
            </div>
            {meal.prepTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{meal.prepTime} min</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
