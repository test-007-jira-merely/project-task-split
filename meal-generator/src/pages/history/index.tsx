import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mealService } from '../../services/mealService';
import { useAuth } from '../../hooks/useAuth';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import type { Meal } from '../../types';

export function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: history = [] } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => user ? mealService.getHistory(user.id) : [],
    enabled: !!user,
  });

  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const handleToggleFavorite = async (mealId: string) => {
    if (!user) return;

    const isFavorite = favorites.some(f => f.mealId === mealId);

    if (isFavorite) {
      await mealService.removeFavorite(user.id, mealId);
    } else {
      await mealService.addFavorite(user.id, mealId);
    }
    refetchFavorites();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Meal History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your recently generated meals
        </p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-16 h-16" />}
          title="No history yet"
          description="Start generating meals to see your history here"
          action={
            <Button onClick={() => navigate('/')}>
              Generate Meal
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((entry) => (
            entry.meal && (
              <MealCard
                key={entry.id}
                meal={entry.meal}
                onViewDetails={() => {
                  setSelectedMeal(entry.meal!);
                  setIsModalOpen(true);
                }}
                onToggleFavorite={() => handleToggleFavorite(entry.mealId)}
                isFavorite={favorites.some(f => f.mealId === entry.mealId)}
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
          onToggleFavorite={() => handleToggleFavorite(selectedMeal.id)}
          isFavorite={favorites.some(f => f.mealId === selectedMeal.id)}
        />
      )}
    </div>
  );
}
