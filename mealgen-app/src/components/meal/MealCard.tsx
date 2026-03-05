import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Card from '../ui/Card';
import MatchIndicator from './MatchIndicator';
import type { MealWithMatch } from '@/types';

interface MealCardProps {
  meal: MealWithMatch;
  onClick?: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  showMatch?: boolean;
}

export default function MealCard({
  meal,
  onClick,
  onFavoriteToggle,
  isFavorite = false,
  showMatch = false,
}: MealCardProps) {
  return (
    <Card hover className="cursor-pointer group" onClick={onClick}>
      <div className="relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {showMatch && meal.matchPercentage !== undefined && (
          <div className="absolute top-3 left-3">
            <MatchIndicator
              percentage={meal.matchPercentage}
              matchedCount={meal.matchedIngredients?.length}
              totalCount={meal.ingredients.length}
            />
          </div>
        )}
        {onFavoriteToggle && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </motion.button>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-500 transition-colors">
            {meal.name}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
            {meal.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {meal.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>{meal.ingredients.length} ingredients</span>
          {meal.difficulty && (
            <span className="capitalize">{meal.difficulty}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
