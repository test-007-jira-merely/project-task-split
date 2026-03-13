import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History as HistoryIcon } from 'lucide-react';
import { AnimatedContainer } from '../../components/ui/AnimatedContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { fetchMeals, fetchHistory, fetchFavorites, addFavorite, removeFavorite } from '../../services/mealService';
import { useAppStore } from '../../stores/useAppStore';
import type { Meal } from '../../types';

export const HistoryPage = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAppStore((state) => state.user);

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
  });

  const { data: history = [] } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => (user ? fetchHistory(user.id) : []),
    enabled: !!user,
  });

  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => (user ? fetchFavorites(user.id) : []),
    enabled: !!user,
  });

  const historyMeals = history
    .map((h) => ({
      meal: meals.find((m) => m.id === h.meal_id),
      generatedAt: h.generated_at,
    }))
    .filter((item) => item.meal !== undefined) as { meal: Meal; generatedAt: string }[];

  const handleToggleFavorite = async (mealId: string) => {
    if (!user) return;

    const existingFavorite = favorites.find((f) => f.meal_id === mealId);

    try {
      if (existingFavorite) {
        await removeFavorite(existingFavorite.id);
      } else {
        await addFavorite(user.id, mealId);
      }
      refetchFavorites();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const isFavorite = (mealId: string) => favorites.some((f) => f.meal_id === mealId);

  return (
    <div className="space-y-8">
      <AnimatedContainer>
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            Meal History
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Recently generated meals
          </p>
        </div>
      </AnimatedContainer>

      {historyMeals.length > 0 ? (
        <AnimatedContainer delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyMeals.map(({ meal }) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onView={() => {
                  setSelectedMeal(meal);
                  setIsModalOpen(true);
                }}
                onFavorite={user ? () => handleToggleFavorite(meal.id) : undefined}
                isFavorite={isFavorite(meal.id)}
              />
            ))}
          </div>
        </AnimatedContainer>
      ) : (
        <EmptyState
          icon={HistoryIcon}
          title="No history yet"
          description="Start generating meals to see your history"
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
