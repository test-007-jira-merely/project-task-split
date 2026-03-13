import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mealService } from '../../services/mealService';
import { useAuth } from '../../hooks/useAuth';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import type { Meal } from '../../types';

export function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: favorites = [], refetch } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const handleRemoveFavorite = async (mealId: string) => {
    if (!user) return;
    await mealService.removeFavorite(user.id, mealId);
    refetch();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Your Favorite Meals
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          All your saved meals in one place
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
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
          {favorites.map((favorite) => (
            favorite.meal && (
              <MealCard
                key={favorite.id}
                meal={favorite.meal}
                onViewDetails={() => {
                  setSelectedMeal(favorite.meal!);
                  setIsModalOpen(true);
                }}
                onToggleFavorite={() => handleRemoveFavorite(favorite.mealId)}
                isFavorite={true}
              />
            )
          ))}
        </div>
      )}

      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onToggleFavorite={() => handleRemoveFavorite(selectedMeal.id)}
          isFavorite={true}
        />
      )}
    </div>
  );
}
