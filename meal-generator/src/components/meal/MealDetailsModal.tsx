import { Heart } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Meal } from '../../types';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  matchedIngredients?: string[];
  missingIngredients?: string[];
}

export function MealDetailsModal({
  meal,
  isOpen,
  onClose,
  onToggleFavorite,
  isFavorite,
  matchedIngredients,
  missingIngredients,
}: MealDetailsModalProps) {
  if (!meal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-64 object-cover rounded-xl"
        />

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {meal.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {meal.description}
            </p>
          </div>
          {onToggleFavorite && (
            <Button
              onClick={onToggleFavorite}
              variant={isFavorite ? 'primary' : 'outline'}
              size="sm"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {meal.category}
            </p>
          </div>
          {meal.difficulty && (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {meal.difficulty}
              </p>
            </div>
          )}
          {meal.prepTime && (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">Prep Time</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {meal.prepTime} min
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {meal.ingredients.map((ingredient, index) => {
              const isMatched = matchedIngredients?.includes(ingredient);
              const isMissing = missingIngredients?.includes(ingredient);

              return (
                <li
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    isMatched
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : isMissing
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {ingredient}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {instruction}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
