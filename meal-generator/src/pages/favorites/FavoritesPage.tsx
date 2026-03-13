import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { mealService } from '@/services/mealService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Meal } from '@/types/meal';

export function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      return mealService.removeFavorite(user.id, mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState
          icon={Heart}
          title="Login required"
          description="Please login to view your favorite meals"
          action={
            <Button onClick={() => navigate('/auth/login')}>
              Login
            </Button>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Your Favorite Meals
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          All your saved recipes in one place
        </p>
      </div>

      {favorites.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onView={setSelectedMeal}
              onFavorite={(m) => removeFavoriteMutation.mutate(m.id)}
              isFavorite={true}
            />
          ))}
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={() => selectedMeal && removeFavoriteMutation.mutate(selectedMeal.id)}
        isFavorite={true}
      />
    </div>
  );
}
