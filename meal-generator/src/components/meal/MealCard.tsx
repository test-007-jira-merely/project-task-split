import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '../../types';
import { CategoryBadge } from './CategoryBadge';

interface MealCardProps {
  meal: Meal;
  onView?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  showMatchIndicator?: boolean;
  matchPercentage?: number;
}

export const MealCard = ({
  meal,
  onView,
  onFavorite,
  isFavorite = false,
  showMatchIndicator = false,
  matchPercentage,
}: MealCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-glass dark:shadow-glass-dark overflow-hidden cursor-pointer group"
      onClick={onView}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {showMatchIndicator && matchPercentage !== undefined && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2">
            <div className="relative w-12 h-12">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - matchPercentage / 100)}`}
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {matchPercentage}%
              </div>
            </div>
          </div>
        )}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            className="absolute top-4 left-4 p-2 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {meal.name}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {meal.description}
        </p>
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          {meal.prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{meal.prepTime} min</span>
            </div>
          )}
          {meal.difficulty && (
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span className="capitalize">{meal.difficulty}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <CategoryBadge category={meal.category} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {meal.ingredients.length} ingredients
          </span>
        </div>
      </div>
    </motion.div>
  );
};
