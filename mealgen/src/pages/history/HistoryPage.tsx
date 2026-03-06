import { useState, useMemo } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { AnimatedContainer, EmptyState, LoadingSkeleton } from '@/components/ui';
import { MealCard, MealDetailsModal } from '@/components/meal';
import { AppLayout } from '@/components/layout';
import { useMeals } from '@/hooks/useMeals';
import { useAppStore } from '@/stores/useAppStore';
import type { Meal } from '@/types';

export function HistoryPage() {
  const { data: meals, isLoading } = useMeals();
  const history = useAppStore((state) => state.history);
  const isFavorite = useAppStore((state) => state.isFavorite);
  const addFavorite = useAppStore((state) => state.addFavorite);
  const removeFavorite = useAppStore((state) => state.removeFavorite);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Get history meals in order
  const historyMeals = useMemo(() => {
    if (!meals) return [];
    // Map history IDs to meals, maintaining order
    return history
      .map((id) => meals.find((meal) => meal.id === id))
      .filter((meal): meal is Meal => meal !== undefined);
  }, [meals, history]);

  const handleToggleFavorite = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  return (
    <AppLayout>
      <AnimatedContainer>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              History
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Recently generated meals
          </p>
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingSkeleton count={6} height="h-96" />
            </div>
          ) : historyMeals.length === 0 ? (
            <EmptyState
              icon={<ClockIcon className="w-16 h-16" />}
              title="No history yet"
              description="Your generated meals will appear here. Start by generating random meals from the home page."
            />
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {historyMeals.length} {historyMeals.length === 1 ? 'meal' : 'meals'} in history
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyMeals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onFavorite={() => handleToggleFavorite(meal.id)}
                    isFavorite={isFavorite(meal.id)}
                    onClick={() => setSelectedMeal(meal)}
                    showActions
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Meal Details Modal */}
        <MealDetailsModal
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onFavorite={
            selectedMeal ? () => handleToggleFavorite(selectedMeal.id) : undefined
          }
          isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
        />
      </AnimatedContainer>
    </AppLayout>
  );
}
