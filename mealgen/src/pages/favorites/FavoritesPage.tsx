import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { useMeals } from '@/hooks/useMeals';
import { useFavorites } from '@/hooks/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import { HeartIcon } from '@heroicons/react/24/outline';
import type { Meal } from '@/types';

export function FavoritesPage() {
  const { data: meals = [], isLoading: mealsLoading } = useMeals();
  const { favorites, removeFavorite, isLoading: favoritesLoading } = useFavorites();
  const isFavorite = useAppStore(state => state.isFavorite);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const favoriteMeals = useMemo(
    () => meals.filter(meal => favorites.includes(meal.id)),
    [meals, favorites]
  );

  const isLoading = mealsLoading || favoritesLoading;

  return (
    <AppLayout>
      <AnimatedContainer className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved meals for quick access
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <LoadingSkeleton key={i} count={3} height="h-64" />
            ))}
          </div>
        ) : favoriteMeals.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            description="Start adding meals to your favorites to see them here"
            icon={<HeartIcon className="w-16 h-16" />}
            action={{
              label: "Discover Meals",
              onClick: () => window.location.href = '/',
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteMeals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                onFavorite={() => removeFavorite(meal.id)}
                isFavorite={true}
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
          onFavorite={selectedMeal ? () => removeFavorite(selectedMeal.id) : undefined}
          isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
        />
      </AnimatedContainer>
    </AppLayout>
  );
}
