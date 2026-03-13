import { Modal } from '@/components/ui/Modal';
import { Heart, Clock, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Meal } from '@/types/meal';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function MealDetailsModal({ meal, isOpen, onClose, onFavorite, isFavorite }: MealDetailsModalProps) {
  if (!meal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-64 object-cover rounded-xl"
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {meal.name}
            </h2>
            {onFavorite && (
              <Button
                onClick={onFavorite}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium capitalize">
              {meal.category}
            </span>
            {meal.difficulty && (
              <span className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium capitalize">
                <ChefHat className="w-4 h-4" />
                {meal.difficulty}
              </span>
            )}
            {meal.prepTime && (
              <span className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4" />
                {meal.prepTime} minutes
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {meal.description}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Ingredients
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {meal.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li
                key={index}
                className="flex gap-3 text-gray-700 dark:text-gray-300"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
