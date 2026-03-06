import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { useMeals } from '@/hooks/useMeals';
import { useHistory } from '@/hooks/useHistory';
import { useFavorites } from '@/hooks/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import { ClockIcon } from '@heroicons/react/24/outline';
import type { Meal } from '@/types';

export function HistoryPage() {
  const { data: meals = [] } = useMeals();
  const { addFavorite, removeFavorite } = useFavorites();
  const { history } = useHistory();
  const isFavorite = useAppStore(state => state.isFavorite);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const historyMeals = useMemo(
    () => history.map((id: string) => meals.find(meal => meal.id === id)).filter((meal): meal is Meal => meal !== undefined),
    [meals, history]
  );

  const handleFavoriteToggle = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  return (
    <AppLayout>
      <AnimatedContainer className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Meal History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Recently generated and viewed meals
          </p>
        </div>

        {historyMeals.length === 0 ? (
          <EmptyState
            title="No history yet"
            description="Meals you generate or view will appear here"
            icon={<ClockIcon className="w-16 h-16" />}
            action={{
              label: "Generate a Meal",
              onClick: () => window.location.href = '/',
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyMeals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                onFavorite={() => handleFavoriteToggle(meal.id)}
                isFavorite={isFavorite(meal.id)}
                onClick={() => setSelectedMeal(meal)}
                showActions
              />
            ))}
          </div>
        )}

        <MealDetailsModal
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onFavorite={selectedMeal ? () => handleFavoriteToggle(selectedMeal.id) : undefined}
          isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
        />
      </AnimatedContainer>
    </AppLayout>
  );
}
