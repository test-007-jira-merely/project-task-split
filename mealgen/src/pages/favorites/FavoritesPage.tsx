import { useState, useMemo } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { AnimatedContainer, EmptyState, LoadingSkeleton } from '@/components/ui';
import { MealCard, MealDetailsModal } from '@/components/meal';
import { AppLayout } from '@/components/layout';
import { useMeals } from '@/hooks/useMeals';
import { useAppStore } from '@/stores/useAppStore';
import type { Meal } from '@/types';

export function FavoritesPage() {
  const { data: meals, isLoading } = useMeals();
  const favorites = useAppStore((state) => state.favorites);
  const isFavorite = useAppStore((state) => state.isFavorite);
  const removeFavorite = useAppStore((state) => state.removeFavorite);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Get favorite meals
  const favoriteMeals = useMemo(() => {
    if (!meals) return [];
    return meals.filter((meal) => favorites.includes(meal.id));
  }, [meals, favorites]);

  const handleToggleFavorite = (mealId: string) => {
    removeFavorite(mealId);
  };

  return (
    <AppLayout>
      <AnimatedContainer>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Favorites
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your saved meal collection
          </p>
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingSkeleton count={6} height="h-96" />
            </div>
          ) : favoriteMeals.length === 0 ? (
            <EmptyState
              icon={<HeartIcon className="w-16 h-16" />}
              title="No favorites yet"
              description="Start adding meals to your favorites to see them here. You can favorite meals from the home page or ingredients page."
            />
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {favoriteMeals.length} {favoriteMeals.length === 1 ? 'meal' : 'meals'} saved
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteMeals.map((meal) => (
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
