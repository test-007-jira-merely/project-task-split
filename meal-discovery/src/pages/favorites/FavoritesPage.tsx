import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppStore } from '@/stores/useAppStore';
import { mealService, favoritesService } from '@/services/supabase';
import { Meal } from '@/types/meal.types';

export default function FavoritesPage() {
  const { user, favorites, removeFavorite } = useAppStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, [favorites]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const allMeals = await mealService.getAllMeals();
      const favoriteMeals = allMeals.filter(meal => favorites.includes(meal.id));
      setMeals(favoriteMeals);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (mealId: string) => {
    if (!user) return;

    try {
      await favoritesService.removeFavorite(user.id, mealId);
      removeFavorite(mealId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Your Favorites
        </h1>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div>
      <AnimatedContainer>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Your Favorites
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {meals.length} saved {meals.length === 1 ? 'meal' : 'meals'}
        </p>

        {meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                isFavorite={true}
                onFavoriteToggle={() => handleRemoveFavorite(meal.id)}
                onClick={() => {
                  setSelectedMeal(meal);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No favorites yet"
            description="Start adding meals to your favorites from the home or ingredients page"
            icon={<Heart className="w-16 h-16" />}
          />
        )}

        <MealDetailsModal
          meal={selectedMeal}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isFavorite={true}
          onFavoriteToggle={
            selectedMeal ? () => handleRemoveFavorite(selectedMeal.id) : undefined
          }
        />
      </AnimatedContainer>
    </div>
  );
}
