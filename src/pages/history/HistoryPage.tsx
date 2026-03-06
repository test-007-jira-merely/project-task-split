import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppStore } from '@/stores/useAppStore';
import { getAllMeals } from '@/services/mealService';
import { getHistory } from '@/services/supabaseData';
import { addFavorite, removeFavorite } from '@/services/supabaseData';
import { Meal } from '@/types/meal';

export const HistoryPage = () => {
  const { user, history, setHistory, favorites, addFavorite: addFavoriteStore, removeFavorite: removeFavoriteStore } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const { data: allMeals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: getAllMeals,
  });

  useEffect(() => {
    if (user) {
      getHistory(user.id)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setIsLoadingHistory(false));
    }
  }, [user, setHistory]);

  const historyMeals = useMemo(() => {
    const uniqueIds = Array.from(new Set(history));
    return uniqueIds
      .map(id => allMeals.find(meal => meal.id === id))
      .filter((meal): meal is Meal => meal !== undefined);
  }, [allMeals, history]);

  const handleFavorite = async (mealId: string) => {
    if (!user) return;

    try {
      if (favorites.includes(mealId)) {
        await removeFavorite(user.id, mealId);
        removeFavoriteStore(mealId);
      } else {
        await addFavorite(user.id, mealId);
        addFavoriteStore(mealId);
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  if (isLoading || isLoadingHistory) {
    return <LoadingSkeleton type="grid" count={6} />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Meal History</h1>
        <p className="text-xl text-muted-foreground">
          Revisit your recently generated meals
        </p>
      </div>

      {historyMeals.length === 0 ? (
        <EmptyState
          icon={<Clock size={64} />}
          title="No history yet"
          description="Generate meals to see them appear in your history"
        />
      ) : (
        <div>
          <p className="text-center text-muted-foreground mb-6">
            {historyMeals.length} meal{historyMeals.length !== 1 ? 's' : ''} in history
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyMeals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                isFavorite={favorites.includes(meal.id)}
                onFavorite={() => handleFavorite(meal.id)}
                onRemoveFavorite={() => handleFavorite(meal.id)}
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
        onFavorite={selectedMeal ? () => handleFavorite(selectedMeal.id) : undefined}
      />
    </div>
  );
};
