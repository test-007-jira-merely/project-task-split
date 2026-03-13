import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { MealCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { mealService } from '@/services/mealService';
import { useAppStore } from '@/stores/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import type { Meal } from '@/types/meal';

export function HomePage() {
  const { user } = useAuth();
  const { currentMeal, setCurrentMeal, lastGeneratedMealId, setLastGeneratedMealId, favoriteIds } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
  });

  const addToHistoryMutation = useMutation({
    mutationFn: ({ userId, mealId }: { userId: string; mealId: string }) =>
      mealService.addToHistory(userId, mealId),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ userId, mealId, isFavorite }: { userId: string; mealId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        await mealService.removeFavorite(userId, mealId);
      } else {
        await mealService.addFavorite(userId, mealId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const generateRandomMeal = () => {
    if (meals.length === 0) return;

    let availableMeals = meals;
    if (lastGeneratedMealId && meals.length > 1) {
      availableMeals = meals.filter(m => m.id !== lastGeneratedMealId);
    }

    const randomIndex = Math.floor(Math.random() * availableMeals.length);
    const meal = availableMeals[randomIndex];

    setCurrentMeal(meal);
    setLastGeneratedMealId(meal.id);

    if (user) {
      addToHistoryMutation.mutate({ userId: user.id, mealId: meal.id });
    }
  };

  const handleToggleFavorite = () => {
    if (!user || !currentMeal) return;
    const isFavorite = favoriteIds.includes(currentMeal.id);
    toggleFavoriteMutation.mutate({
      userId: user.id,
      mealId: currentMeal.id,
      isFavorite,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MealCardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Your Next Meal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Let AI inspire your cooking journey
        </p>
        <Button
          size="lg"
          onClick={generateRandomMeal}
          className="gap-3 text-lg px-8 py-4"
        >
          <Shuffle className="w-6 h-6" />
          Generate Random Meal
        </Button>
      </motion.div>

      {currentMeal && (
        <motion.div
          key={currentMeal.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-3xl p-8 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={currentMeal.imageUrl}
                alt={currentMeal.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium capitalize">
                    {currentMeal.category}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentMeal.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {currentMeal.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ingredients: {currentMeal.ingredients.length}
                  </p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Steps: {currentMeal.instructions.length}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setModalOpen(true)}
                className="w-full mt-6"
                size="lg"
              >
                View Full Recipe
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <MealDetailsModal
        meal={currentMeal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onFavorite={user ? handleToggleFavorite : undefined}
        isFavorite={currentMeal ? favoriteIds.includes(currentMeal.id) : false}
      />
    </div>
  );
}
