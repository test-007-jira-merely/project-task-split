import { Modal, Badge, Button } from '../ui';
import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import { useAddFavorite, useRemoveFavorite } from '../../hooks';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  matchPercentage?: number;
  matchedIngredients?: string[];
  missingIngredients?: string[];
}

export function MealDetailsModal({
  meal,
  isOpen,
  onClose,
  matchPercentage,
  matchedIngredients,
  missingIngredients
}: MealDetailsModalProps) {
  const user = useAppStore(state => state.user);
  const favorites = useAppStore(state => state.favorites);
  const isFavorite = meal ? favorites.includes(meal.id) : false;

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  if (!meal) return null;

  const handleFavoriteClick = () => {
    if (!user) return;

    if (isFavorite) {
      removeFavorite.mutate(meal.id);
    } else {
      addFavorite.mutate(meal.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="relative h-64 -mx-6 -mt-6 mb-6">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {meal.name}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary">{meal.category}</Badge>
              {meal.difficulty && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <ChefHat className="w-4 h-4" />
                  <span className="capitalize">{meal.difficulty}</span>
                </div>
              )}
              {meal.prepTime && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{meal.prepTime} min</span>
                </div>
              )}
              {matchPercentage !== undefined && (
                <Badge variant={matchPercentage === 100 ? 'success' : matchPercentage >= 70 ? 'warning' : 'secondary'}>
                  {matchPercentage}% Match
                </Badge>
              )}
            </div>
          </div>
          {user && (
            <Button
              variant={isFavorite ? 'danger' : 'secondary'}
              size="sm"
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {meal.description}
        </p>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {meal.ingredients.map((ingredient, index) => {
              const isMatched = matchedIngredients?.includes(ingredient);
              const isMissing = missingIngredients?.includes(ingredient);

              return (
                <li
                  key={index}
                  className={`flex items-center gap-2 text-gray-700 dark:text-gray-300 ${
                    isMatched ? 'text-green-600 dark:text-green-400' : ''
                  } ${isMissing ? 'text-red-600 dark:text-red-400' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  {ingredient}
                  {isMatched && <Badge variant="success">✓</Badge>}
                  {isMissing && <Badge variant="danger">✗</Badge>}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
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
