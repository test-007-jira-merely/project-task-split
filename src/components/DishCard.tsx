import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Meal } from '../types/meal';
import { useMealStore } from '../store/useMealStore';
import MatchIndicator from './MatchIndicator';

interface DishCardProps {
  meal: Meal;
  matchPercentage?: number;
}

export default function DishCard({ meal, matchPercentage }: DishCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { favorites, toggleFavorite } = useMealStore();
  const isFavorite = favorites.includes(meal.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden max-w-3xl mx-auto"
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{meal.name}</h2>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {meal.category}
              </span>
            </div>
            <motion.button
              onClick={() => toggleFavorite(meal.id)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
            </motion.button>
          </div>
        </div>

        {/* Match Indicator */}
        {matchPercentage !== undefined && (
          <div className="absolute top-4 right-4">
            <MatchIndicator percentage={matchPercentage} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {meal.description}
        </p>

        {/* Expand/Collapse Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full btn-secondary flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{isExpanded ? 'Show Less' : 'Show Details'}</span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </motion.button>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-6">
                {/* Ingredients */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                      >
                        {ingredient}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {meal.instructions.map((instruction, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 pt-0.5">
                          {instruction}
                        </span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
