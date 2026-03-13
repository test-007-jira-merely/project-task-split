import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '../../types';
import { Button } from '../ui/Button';

interface MealCardProps {
  meal: Meal;
  onViewDetails: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  matchPercentage?: number;
}

export function MealCard({
  meal,
  onViewDetails,
  onToggleFavorite,
  isFavorite,
  matchPercentage
}: MealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-48 object-cover"
        />
        {matchPercentage !== undefined && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {matchPercentage}% Match
          </div>
        )}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className="absolute top-3 left-3 p-2 bg-white dark:bg-gray-900 rounded-full hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {meal.name}
          </h3>
          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
            {meal.category}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {meal.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-500">
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

        <Button onClick={onViewDetails} variant="outline" className="w-full">
          View Recipe
        </Button>
      </div>
    </motion.div>
  );
}
