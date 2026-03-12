import { MealDetailsModalProps } from '@/types/components';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Heart, Clock, ChefHat } from 'lucide-react';

export const MealDetailsModal = ({
  meal,
  isOpen,
  onClose,
  onFavorite,
  isFavorite
}: MealDetailsModalProps) => {
  if (!meal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={meal.name}>
      <div className="p-6">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />

        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm">
            {meal.category}
          </span>
          {meal.prepTime && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              {meal.prepTime} mins
            </div>
          )}
          {meal.difficulty && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <ChefHat className="w-4 h-4" />
              {meal.difficulty}
            </div>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">{meal.description}</p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
          <ul className="space-y-2">
            {meal.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-600" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Instructions</h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {onFavorite && (
          <Button
            variant={isFavorite ? 'secondary' : 'primary'}
            className="w-full"
            onClick={() => onFavorite(meal.id)}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        )}
      </div>
    </Modal>
  );
};
