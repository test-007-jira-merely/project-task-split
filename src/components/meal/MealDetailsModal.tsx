import { Meal } from '@/types/models';
import { Modal } from '@/components/ui/Modal';
import { CategoryBadge } from './CategoryBadge';
import { Clock, ChefHat } from 'lucide-react';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MealDetailsModal({ meal, isOpen, onClose }: MealDetailsModalProps) {
  if (!meal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Image */}
        <div className="w-full h-64 rounded-xl overflow-hidden">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h2 className="text-3xl font-bold text-foreground">{meal.name}</h2>
            <CategoryBadge category={meal.category} />
          </div>

          <p className="text-muted-foreground">{meal.description}</p>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {meal.preparationTime && (
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{meal.preparationTime} minutes</span>
              </div>
            )}
            {meal.difficulty && (
              <div className="flex items-center space-x-1">
                <ChefHat size={16} />
                <span className="capitalize">{meal.difficulty}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">Ingredients</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {meal.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                <span className="capitalize">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">Instructions</h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
