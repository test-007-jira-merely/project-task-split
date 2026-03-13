import type { Meal } from '../../types';
import { Modal } from '../ui/Modal';
import { CategoryBadge } from './CategoryBadge';
import { Clock, ChefHat, Users } from 'lucide-react';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MealDetailsModal = ({ meal, isOpen, onClose }: MealDetailsModalProps) => {
  if (!meal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{meal.name}</h2>
          <CategoryBadge category={meal.category} />
        </div>

        <div className="flex items-center gap-6 mb-6 text-gray-600 dark:text-gray-400">
          {meal.prepTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{meal.prepTime} minutes</span>
            </div>
          )}
          {meal.difficulty && (
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              <span className="capitalize">{meal.difficulty}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{meal.ingredients.length} ingredients</span>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">{meal.description}</p>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Ingredients
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {meal.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 pt-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
};
