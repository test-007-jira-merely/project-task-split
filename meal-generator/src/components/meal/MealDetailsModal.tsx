import { CheckCircle, Circle, Clock, ChefHat } from 'lucide-react';
import { Meal, MealMatch } from '@/types/meal';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface MealDetailsModalProps {
  meal: Meal | MealMatch | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

export const MealDetailsModal = ({ meal, isOpen, onClose, onFavorite, isFavorited }: MealDetailsModalProps) => {
  if (!meal) return null;

  const mealMatch = 'matchPercentage' in meal ? meal : null;

  const categoryColors = {
    breakfast: 'warning',
    lunch: 'primary',
    dinner: 'success',
    snack: 'secondary',
  } as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-6">
        <div className="relative">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-64 object-cover rounded-2xl"
          />
          {mealMatch && (
            <div className="absolute top-4 right-4">
              <Badge variant={mealMatch.matchPercentage === 100 ? 'success' : 'warning'} size="md">
                {mealMatch.matchPercentage}% Match
              </Badge>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {meal.name}
              </h2>
              <div className="flex items-center gap-3">
                <Badge variant={categoryColors[meal.category]}>
                  {meal.category}
                </Badge>
                {meal.preparationTime && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{meal.preparationTime} min</span>
                  </div>
                )}
                {meal.difficulty && (
                  <Badge variant="secondary">
                    {meal.difficulty}
                  </Badge>
                )}
              </div>
            </div>
            {onFavorite && (
              <Button
                variant={isFavorited ? 'danger' : 'secondary'}
                onClick={onFavorite}
              >
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            {meal.description}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Ingredients
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {meal.ingredients.map((ingredient, index) => {
              const isMatched = mealMatch?.matchedIngredients.includes(ingredient);
              const isMissing = mealMatch?.missingIngredients.includes(ingredient);

              return (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl
                    ${isMatched
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : isMissing
                      ? 'bg-gray-50 dark:bg-gray-800/50'
                      : 'bg-gray-50 dark:bg-gray-800'
                    }
                  `}
                >
                  {isMatched ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={`
                    ${isMatched
                      ? 'text-green-900 dark:text-green-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    {ingredient}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-700 dark:text-gray-300 pt-1">
                  {instruction}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
};
