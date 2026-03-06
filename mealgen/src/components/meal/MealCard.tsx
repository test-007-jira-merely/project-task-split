import { motion } from 'framer-motion';
import { HeartIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { MealCardProps } from '@/types/components';
import { Card } from '@/components/ui';

export function MealCard({
  meal,
  onFavorite,
  isFavorite = false,
  matchPercentage,
  onClick,
  showActions = true,
}: MealCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      breakfast: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      lunch: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      dinner: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      snack: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    };
    return colors[category as keyof typeof colors] || colors.lunch;
  };

  const getDifficultyColor = (difficulty?: string) => {
    const colors = {
      easy: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      hard: 'text-red-600 dark:text-red-400',
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  return (
    <Card className="overflow-hidden p-0 relative" onClick={onClick}>
      {/* Match Percentage Badge */}
      {matchPercentage !== undefined && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {matchPercentage}% Match
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Favorite Button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            {meal.name}
          </h3>
          {showActions && onFavorite && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFavorite ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-gray-400" />
              )}
            </motion.button>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {meal.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Badge */}
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(
              meal.category
            )}`}
          >
            {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
          </span>

          {/* Preparation Time */}
          {meal.preparationTime && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
              <ClockIcon className="w-4 h-4" />
              <span>{meal.preparationTime} min</span>
            </div>
          )}

          {/* Difficulty */}
          {meal.difficulty && (
            <span className={`text-sm font-medium ${getDifficultyColor(meal.difficulty)}`}>
              {meal.difficulty.charAt(0).toUpperCase() + meal.difficulty.slice(1)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
