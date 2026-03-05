import { Heart, Clock, ChefHat } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import MatchIndicator from './MatchIndicator';
import type { MealWithMatch } from '@/types';

interface MealDetailsModalProps {
  meal: MealWithMatch | null;
  isOpen: boolean;
  onClose: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
}

export default function MealDetailsModal({
  meal,
  isOpen,
  onClose,
  onFavoriteToggle,
  isFavorite = false,
}: MealDetailsModalProps) {
  if (!meal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Image */}
        <div className="relative -mx-6 -mt-6">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-64 object-cover"
          />
          {meal.matchPercentage !== undefined && (
            <div className="absolute top-4 left-4">
              <MatchIndicator
                percentage={meal.matchPercentage}
                matchedCount={meal.matchedIngredients?.length}
                totalCount={meal.ingredients.length}
                size="lg"
              />
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {meal.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {meal.description}
            </p>
          </div>
          {onFavoriteToggle && (
            <Button
              variant={isFavorite ? 'danger' : 'secondary'}
              onClick={onFavoriteToggle}
              className="ml-4"
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Remove' : 'Favorite'}
            </Button>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
              {meal.category}
            </span>
          </div>
          {meal.preparationTime && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{meal.preparationTime} min</span>
            </div>
          )}
          {meal.difficulty && (
            <div className="flex items-center">
              <ChefHat className="w-4 h-4 mr-1" />
              <span className="capitalize">{meal.difficulty}</span>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Ingredients ({meal.ingredients.length})
          </h3>
          <div className="space-y-2">
            {meal.ingredients.map((ingredient, index) => {
              const isMatched = meal.matchedIngredients?.includes(ingredient);
              const isMissing = meal.missingIngredients?.includes(ingredient);

              return (
                <div
                  key={index}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    isMatched
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : isMissing
                      ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{isMatched ? '✓' : '○'}</span>
                  <span>{ingredient}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
