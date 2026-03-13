import { useState, useMemo } from 'react';
import { History as HistoryIcon, Calendar } from 'lucide-react';
import { EmptyState, MealCardSkeleton } from '../../components/ui';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { useMeals, useHistory } from '../../hooks';
import type { Meal } from '../../types';

export default function HistoryPage() {
  const { data: meals, isLoading: mealsLoading } = useMeals();
  const { data: history, isLoading: historyLoading } = useHistory();

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const historyMeals = useMemo(() => {
    if (!meals || !history) return [];

    const mealMap = new Map(meals.map(m => [m.id, m]));
    const uniqueMealIds = Array.from(new Set(history.map(h => h.mealId)));

    return uniqueMealIds
      .map(id => mealMap.get(id))
      .filter((meal): meal is Meal => meal !== undefined);
  }, [meals, history]);

  const isLoading = mealsLoading || historyLoading;

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          Your Meal History
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Recently viewed and generated meals
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : historyMeals.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon className="w-16 h-16" />}
            title="No history yet"
            description="Meals you generate or view will appear here"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onClick={() => handleMealClick(meal)}
              />
            ))}
          </div>
        )}
      </div>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
