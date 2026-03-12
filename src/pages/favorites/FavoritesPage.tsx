import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppStore } from '@/stores/useAppStore';
import { getAllMeals } from '@/services/mealService';
import { getFavorites, removeFavorite } from '@/services/supabaseData';
import { Meal } from '@/types/meal';

export const FavoritesPage = () => {
  const { user, favorites, setFavorites, removeFavorite: removeFavoriteStore } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const { data: allMeals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: getAllMeals,
  });

  useEffect(() => {
    if (user) {
      getFavorites(user.id)
        .then(setFavorites)
        .catch(console.error)
        .finally(() => setIsLoadingFavorites(false));
    }
  }, [user, setFavorites]);

  const favoriteMeals = useMemo(() => {
    return allMeals.filter(meal => favorites.includes(meal.id));
  }, [allMeals, favorites]);

  const handleRemoveFavorite = async (mealId: string) => {
    if (!user) return;

    try {
      await removeFavorite(user.id, mealId);
      removeFavoriteStore(mealId);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (isLoading || isLoadingFavorites) {
    return <LoadingSkeleton type="grid" count={6} />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">My Favorites</h1>
        <p className="text-xl text-muted-foreground">
          Your saved meals, ready when you are
        </p>
      </div>

      {favoriteMeals.length === 0 ? (
        <EmptyState
          icon={<Heart size={64} />}
          title="No favorites yet"
          description="Start adding meals to your favorites to see them here"
        />
      ) : (
        <div>
          <p className="text-center text-muted-foreground mb-6">
            {favoriteMeals.length} favorite meal{favoriteMeals.length !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteMeals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                isFavorite
                onRemoveFavorite={() => handleRemoveFavorite(meal.id)}
                onClick={() => setSelectedMeal(meal)}
              />
            ))}
          </div>
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        isFavorite={selectedMeal ? favorites.includes(selectedMeal.id) : false}
        onFavorite={selectedMeal ? () => handleRemoveFavorite(selectedMeal.id) : undefined}
      />
    </div>
  );
};
