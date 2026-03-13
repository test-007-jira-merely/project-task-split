import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { AnimatedContainer } from '../../components/ui/AnimatedContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { fetchMeals, fetchFavorites, removeFavorite } from '../../services/mealService';
import { useAppStore } from '../../stores/useAppStore';
import type { Meal } from '../../types';

export const FavoritesPage = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAppStore((state) => state.user);

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
  });

  const { data: favorites = [], refetch } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => (user ? fetchFavorites(user.id) : []),
    enabled: !!user,
  });

  const favoriteMeals = meals.filter((meal) =>
    favorites.some((fav) => fav.meal_id === meal.id)
  );

  const handleRemoveFavorite = async (mealId: string) => {
    const favorite = favorites.find((f) => f.meal_id === mealId);
    if (favorite) {
      try {
        await removeFavorite(favorite.id);
        refetch();
      } catch (error) {
        console.error('Failed to remove favorite:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <AnimatedContainer>
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            Your Favorite Meals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Quick access to your saved meal collection
          </p>
        </div>
      </AnimatedContainer>

      {favoriteMeals.length > 0 ? (
        <AnimatedContainer delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onView={() => {
                  setSelectedMeal(meal);
                  setIsModalOpen(true);
                }}
                onFavorite={() => handleRemoveFavorite(meal.id)}
                isFavorite={true}
              />
            ))}
          </div>
        </AnimatedContainer>
      ) : (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Start adding meals to your favorites to see them here"
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
