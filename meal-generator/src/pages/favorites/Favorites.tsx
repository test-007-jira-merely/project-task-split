import { useState } from 'react';
import { Heart } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFavorites } from '@/features/favorites/useFavorites';
import { Meal } from '@/types/meal';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Favorites = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { favoriteMeals, isLoading, isFavorited, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height="400px" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatedContainer>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {favoriteMeals.length} saved {favoriteMeals.length === 1 ? 'meal' : 'meals'}
            </p>
          </div>
        </div>
      </AnimatedContainer>

      {favoriteMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onView={() => setSelectedMeal(meal)}
              onFavorite={() => toggleFavorite(meal.id)}
              isFavorited={isFavorited(meal.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Start adding meals to your favorites to see them here"
          action={
            <Button onClick={() => navigate('/')}>
              Discover Meals
            </Button>
          }
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={selectedMeal ? () => toggleFavorite(selectedMeal.id) : undefined}
        isFavorited={selectedMeal ? isFavorited(selectedMeal.id) : false}
      />
    </div>
  );
};
