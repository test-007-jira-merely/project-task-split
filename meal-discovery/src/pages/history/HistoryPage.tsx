import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppStore } from '@/stores/useAppStore';
import { mealService, favoritesService } from '@/services/supabase';
import { Meal } from '@/types/meal.types';

export default function HistoryPage() {
  const { user, history, favorites, addFavorite, removeFavorite } = useAppStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [history]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const allMeals = await mealService.getAllMeals();
      const historyMeals = history
        .map(id => allMeals.find(meal => meal.id === id))
        .filter((meal): meal is Meal => meal !== undefined);
      setMeals(historyMeals);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (mealId: string) => {
    if (!user) return;

    try {
      const isFav = favorites.includes(mealId);
      if (isFav) {
        await favoritesService.removeFavorite(user.id, mealId);
        removeFavorite(mealId);
      } else {
        await favoritesService.addFavorite(user.id, mealId);
        addFavorite(mealId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Your History
        </h1>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div>
      <AnimatedContainer>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Your History
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Recently generated meals
        </p>

        {meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                isFavorite={favorites.includes(meal.id)}
                onFavoriteToggle={user ? () => handleFavoriteToggle(meal.id) : undefined}
                onClick={() => {
                  setSelectedMeal(meal);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No history yet"
            description="Start generating meals to see them here"
            icon={<Clock className="w-16 h-16" />}
          />
        )}

        <MealDetailsModal
          meal={selectedMeal}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isFavorite={selectedMeal ? favorites.includes(selectedMeal.id) : false}
          onFavoriteToggle={
            user && selectedMeal
              ? () => handleFavoriteToggle(selectedMeal.id)
              : undefined
          }
        />
      </AnimatedContainer>
    </div>
  );
}
