import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { AnimatedContainer } from '../../components/ui/AnimatedContainer';
import { Button } from '../../components/ui/Button';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { MealCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { fetchMeals, addHistory, addFavorite, removeFavorite, fetchFavorites } from '../../services/mealService';
import { useAppStore } from '../../stores/useAppStore';
import { getRandomMeal } from '../../utils/matching';
import type { Meal } from '../../types';

export const HomePage = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, currentMeal, setCurrentMeal, lastGeneratedMealId, setLastGeneratedMealId } = useAppStore();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
  });

  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => (user ? fetchFavorites(user.id) : []),
    enabled: !!user,
  });

  const handleGenerateMeal = async () => {
    if (meals.length === 0) return;

    const randomMeal = getRandomMeal(meals, lastGeneratedMealId || undefined);
    if (randomMeal) {
      setCurrentMeal(randomMeal);
      setLastGeneratedMealId(randomMeal.id);

      if (user) {
        try {
          await addHistory(user.id, randomMeal.id);
        } catch (error) {
          console.error('Failed to add to history:', error);
        }
      }
    }
  };

  const handleViewMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

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
        <div className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
            Discover Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              Delicious Meal
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Generate random meal ideas instantly or search by ingredients you already have
          </p>
          <Button size="lg" onClick={handleGenerateMeal} disabled={isLoading}>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Random Meal
          </Button>
        </div>
      </AnimatedContainer>

      {isLoading && <MealCardSkeleton />}

      {!isLoading && !currentMeal && meals.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="No meals available"
          description="Start by adding meals in the admin panel"
        />
      )}

      {currentMeal && (
        <AnimatedContainer key={currentMeal.id} delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <MealCard
              meal={currentMeal}
              onView={() => handleViewMeal(currentMeal)}
              onFavorite={user ? () => handleToggleFavorite(currentMeal.id) : undefined}
              isFavorite={isFavorite(currentMeal.id)}
            />
          </div>
        </AnimatedContainer>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
