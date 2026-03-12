import { MealCardProps } from '@/types/components';
import { Card } from '../ui/Card';
import { Heart } from 'lucide-react';
import { MatchIndicator } from './MatchIndicator';
import { motion } from 'framer-motion';

export const MealCard = ({
  meal,
  onFavorite,
  onViewDetails,
  isFavorite,
  matchPercentage,
  showActions = true
}: MealCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden cursor-pointer" onClick={() => onViewDetails?.(meal)}>
        <div className="relative">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-48 object-cover rounded-xl"
            loading="lazy"
          />
          {matchPercentage !== undefined && (
            <div className="absolute top-2 right-2">
              <MatchIndicator percentage={matchPercentage} size="sm" />
            </div>
          )}
          {showActions && onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(meal.id);
              }}
              className="absolute top-2 left-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">{meal.name}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
              {meal.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {meal.description}
          </p>
          {meal.prepTime && (
            <p className="text-xs text-gray-500 mt-2">
              {meal.prepTime} mins • {meal.difficulty || 'medium'}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
