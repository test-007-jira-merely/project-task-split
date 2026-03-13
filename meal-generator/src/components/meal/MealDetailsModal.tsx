import { Modal } from '@/components/ui/Modal';
import { Meal } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Clock, ChefHat } from 'lucide-react';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MealDetailsModal({ meal, isOpen, onClose }: MealDetailsModalProps) {
  if (!meal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={meal.name}>
      <div className="space-y-6">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-64 object-cover rounded-2xl"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <Badge>{meal.category}</Badge>
          {meal.prepTime && (
            <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {meal.prepTime} minutes
            </span>
          )}
          {meal.difficulty && (
            <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <ChefHat className="w-4 h-4 mr-1" />
              {meal.difficulty}
            </span>
          )}
        </div>

        <div>
          <p className="text-gray-700 dark:text-gray-300">{meal.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {meal.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700 dark:text-gray-300"
              >
                <span className="text-primary-600 mr-2">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700 dark:text-gray-300"
              >
                <span className="font-semibold text-primary-600 mr-3">
                  {index + 1}.
                </span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
