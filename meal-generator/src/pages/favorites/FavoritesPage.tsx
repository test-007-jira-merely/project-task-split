import { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { useMeals } from '@/hooks/useMeals';
import { useFavorites } from '@/hooks/useFavorites';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Meal } from '@/types';

export function FavoritesPage() {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: meals = [], isLoading: mealsLoading } = useMeals();
  const { data: favoriteIds = [], isLoading: favoritesLoading } = useFavorites();

  const favoriteMeals = useMemo(() => {
    return meals.filter((meal) => favoriteIds.includes(meal.id));
  }, [meals, favoriteIds]);

  if (mealsLoading || favoritesLoading) {
    return <LoadingSkeleton className="h-96" />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Your Favorite Meals
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {favoriteMeals.length} saved {favoriteMeals.length === 1 ? 'meal' : 'meals'}
        </p>
      </div>

      {favoriteMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteMeals.map((meal) => (
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
          icon={<Heart className="w-16 h-16" />}
          title="No Favorites Yet"
          description="Start adding meals to your favorites by clicking the heart icon on any meal card."
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
