import { motion } from 'framer-motion';
import { HeartIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { MealDetailsModalProps } from '@/types/components';
import { Modal, Button } from '@/components/ui';

export function MealDetailsModal({
  meal,
  isOpen,
  onClose,
  onFavorite,
  isFavorite = false,
}: MealDetailsModalProps) {
  if (!meal) return null;

  const getCategoryColor = (category: string) => {
    const colors = {
      breakfast: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      lunch: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      dinner: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      snack: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    };
    return colors[category as keyof typeof colors] || colors.lunch;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {/* Image */}
      <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {meal.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{meal.description}</p>
        </div>
        {onFavorite && (
          <motion.button
            onClick={onFavorite}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-8 h-8 text-red-500" />
            ) : (
              <HeartIcon className="w-8 h-8 text-gray-400" />
            )}
          </motion.button>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <span
          className={`px-3 py-1 rounded-lg text-sm font-medium ${getCategoryColor(
            meal.category
          )}`}
        >
          {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
        </span>
        {meal.preparationTime && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <ClockIcon className="w-5 h-5" />
            <span>{meal.preparationTime} minutes</span>
          </div>
        )}
        {meal.difficulty && (
          <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {meal.difficulty.charAt(0).toUpperCase() + meal.difficulty.slice(1)}
          </span>
        )}
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Ingredients
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {meal.ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>{ingredient}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Instructions
        </h3>
        <ol className="space-y-3">
          {meal.instructions.map((instruction, index) => (
            <li
              key={index}
              className="flex gap-3 text-gray-700 dark:text-gray-300"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
                {index + 1}
              </span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Close Button */}
      <div className="flex justify-end">
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      </div>
    </Modal>
  );
}
