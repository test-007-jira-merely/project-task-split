import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '@types/meal';
import { useFavorites } from '@hooks/useFavorites';
import { useAuth } from '@hooks/useAuth';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MealDetailsModal({ meal, isOpen, onClose }: MealDetailsModalProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  if (!meal) return null;

  const favorite = isFavorite(meal.id);

  const handleFavoriteToggle = async () => {
    if (favorite) {
      await removeFavorite(meal.id);
    } else {
      await addFavorite(meal.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden">
          <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{meal.name}</h2>
            {isAuthenticated && (
              <Button variant="ghost" onClick={handleFavoriteToggle}>
                <Heart
                  className={`w-6 h-6 ${
                    favorite ? 'fill-red-500 text-red-500' : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            <span className="flex items-center gap-1 capitalize">
              <ChefHat className="w-5 h-5" />
              {meal.category}
            </span>
            {meal.difficulty && (
              <span className="capitalize">
                Difficulty: {meal.difficulty}
              </span>
            )}
            {meal.prepTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-5 h-5" />
                {meal.prepTime} minutes
              </span>
            )}
          </div>

          <p className="text-neutral-700 dark:text-neutral-300 mb-6">{meal.description}</p>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Ingredients</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Instructions</h3>
            <ol className="space-y-3">
              {meal.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-neutral-700 dark:text-neutral-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Modal>
  );
}
