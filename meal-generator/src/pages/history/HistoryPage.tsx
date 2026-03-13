import { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { useMeals } from '@/hooks/useMeals';
import { useHistory } from '@/hooks/useHistory';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Meal } from '@/types';

export function HistoryPage() {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: meals = [], isLoading: mealsLoading } = useMeals();
  const { data: history = [], isLoading: historyLoading } = useHistory();

  const historyMeals = useMemo(() => {
    const mealMap = new Map(meals.map((m) => [m.id, m]));
    const uniqueMealIds = Array.from(new Set(history.map((h) => h.meal_id)));

    return uniqueMealIds
      .map((id) => mealMap.get(id))
      .filter((m): m is Meal => m !== undefined);
  }, [meals, history]);

  if (mealsLoading || historyLoading) {
    return <LoadingSkeleton className="h-96" />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Your Meal History
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Recently generated meals
        </p>
      </div>

      {historyMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onClick={() => {
                setSelectedMeal(meal);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Clock className="w-16 h-16" />}
          title="No History Yet"
          description="Start generating meals to build your history."
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
