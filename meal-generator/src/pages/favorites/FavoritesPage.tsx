import { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { EmptyState, MealCardSkeleton } from '../../components/ui';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { useMeals, useFavorites } from '../../hooks';
import type { Meal } from '../../types';

export default function FavoritesPage() {
  const { data: meals, isLoading: mealsLoading } = useMeals();
  const { data: favoriteIds, isLoading: favoritesLoading } = useFavorites();

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const favoriteMeals = useMemo(() => {
    if (!meals || !favoriteIds) return [];
    return meals.filter(meal => favoriteIds.includes(meal.id));
  }, [meals, favoriteIds]);

  const isLoading = mealsLoading || favoritesLoading;

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          Your Favorite Meals
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Quick access to all your saved recipes
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : favoriteMeals.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-16 h-16" />}
            title="No favorites yet"
            description="Start adding meals to your favorites to see them here"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteMeals.map((meal) => (
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
