import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meal } from '../types/meal';
import { useMealStore } from '../store/useMealStore';
import { MatchIndicator } from './MatchIndicator';

interface DishCardProps {
  meal: Meal;
  matchPercentage?: number;
}

export const DishCard = ({ meal, matchPercentage }: DishCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { favorites, toggleFavorite } = useMealStore();
  const isFavorite = favorites.includes(meal.id);

  const getCategoryColor = (category: string) => {
    const colors = {
      breakfast: 'bg-yellow-500',
      lunch: 'bg-green-500',
      dinner: 'bg-blue-500',
      snack: 'bg-purple-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-card-light dark:bg-card-dark rounded-3xl shadow-lg overflow-hidden"
    >
      {/* Image section */}
      <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-primary-light dark:border-t-primary-dark rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 ${getCategoryColor(
              meal.category
            )} text-white text-sm font-semibold rounded-full shadow-lg capitalize`}
          >
            {meal.category}
          </span>
        </div>

        {/* Favorite button */}
        <motion.button
          onClick={() => toggleFavorite(meal.id)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.svg
            className={`w-6 h-6 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </motion.svg>
        </motion.button>

        {/* Meal name */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {meal.name}
          </h2>
        </div>
      </div>

      {/* Content section */}
      <div className="p-6 space-y-4">
        {/* Match indicator */}
        {matchPercentage !== undefined && (
          <MatchIndicator percentage={matchPercentage} />
        )}

        {/* Description */}
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          {meal.description}
        </p>

        {/* Expand button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 bg-surface-light dark:bg-surface-dark text-primary-light dark:text-primary-dark font-medium rounded-2xl hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{isExpanded ? 'Show Less' : 'Show Details'}</span>
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </motion.button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
                  Ingredients ({meal.ingredients.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark text-sm rounded-full border border-border-light dark:border-border-dark"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
                  Instructions
                </h3>
                <ol className="space-y-2">
                  {meal.instructions.map((instruction, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex space-x-3"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-light dark:bg-primary-dark text-white text-sm flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark flex-1">
                        {instruction}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
