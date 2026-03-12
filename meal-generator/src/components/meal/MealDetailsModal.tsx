import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '../../types/database';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../stores/useAppStore';
import { favoriteService } from '../../services/mealService';
import { useState } from 'react';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  matchedIngredients?: string[];
  missingIngredients?: string[];
}

export const MealDetailsModal = ({
  meal,
  isOpen,
  onClose,
  matchedIngredients,
  missingIngredients,
}: MealDetailsModalProps) => {
  const { user, isFavorite, addFavorite, removeFavorite } = useAppStore();
  const [loading, setLoading] = useState(false);

  if (!meal) return null;

  const isLiked = isFavorite(meal.id);

  const handleToggleFavorite = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (isLiked) {
        await favoriteService.removeFavorite(user.id, meal.id);
        removeFavorite(meal.id);
      } else {
        await favoriteService.addFavorite(user.id, meal.id);
        addFavorite(meal.id);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    breakfast: 'warning',
    lunch: 'primary',
    dinner: 'success',
    snack: 'default',
  } as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Image */}
        <div className="relative h-64 -mx-6 -mt-6 rounded-t-3xl overflow-hidden">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{meal.name}</h2>
            <Badge variant={categoryColors[meal.category]}>{meal.category}</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{meal.description}</p>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ChefHat className="h-5 w-5" />
            <span>{meal.ingredients.length} ingredients</span>
          </div>
          {meal.prepTime && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Clock className="h-5 w-5" />
              <span>{meal.prepTime} min</span>
            </div>
          )}
          {meal.difficulty && (
            <Badge variant="default">{meal.difficulty}</Badge>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Ingredients
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {meal.ingredients.map((ingredient, index) => {
              const isMatched = matchedIngredients?.includes(ingredient);
              const isMissing = missingIngredients?.includes(ingredient);

              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                    isMatched
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : isMissing
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-sm">• {ingredient}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 flex-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        {user && (
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleToggleFavorite}
              variant={isLiked ? 'danger' : 'primary'}
              loading={loading}
              className="flex-1"
            >
              <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
