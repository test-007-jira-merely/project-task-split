import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { MealCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { mealService } from '@/services/mealService';
import { useMealGenerator } from '@/hooks/useMealGenerator';
import { useMealStore } from '@/stores/useMealStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Meal } from '@/types/models';

export default function HomePage() {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { currentMeal } = useMealStore();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const addToHistoryMutation = useMutation({
    mutationFn: ({ userId, mealId }: { userId: string; mealId: string }) =>
      mealService.addToHistory(userId, mealId),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      const isFav = favorites.some((f) => f.mealId === mealId);
      if (isFav) {
        await mealService.removeFavorite(user.id, mealId);
      } else {
        await mealService.addFavorite(user.id, mealId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const { generateRandomMeal, isGenerating } = useMealGenerator(meals);

  const handleGenerate = async () => {
    const meal = await generateRandomMeal();
    if (meal && user) {
      addToHistoryMutation.mutate({ userId: user.id, mealId: meal.id });
    }
  };

  const isFavorite = (mealId: string) =>
    favorites.some((f) => f.mealId === mealId);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Discover Your Next Meal
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate random meal ideas or find recipes based on ingredients you have
        </p>
        <Button
          size="lg"
          onClick={handleGenerate}
          isLoading={isGenerating}
          disabled={isLoading || meals.length === 0}
        >
          <Sparkles className="mr-2" size={20} />
          Generate Random Meal
        </Button>
      </motion.div>

      {/* Current Meal Display */}
      <AnimatePresence mode="wait">
        {currentMeal && (
          <motion.div
            key={currentMeal.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MealCard
              meal={currentMeal}
              onFavorite={() => toggleFavoriteMutation.mutate(currentMeal.id)}
              isFavorite={isFavorite(currentMeal.id)}
              onClick={() => setSelectedMeal(currentMeal)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && !currentMeal && <MealCardSkeleton />}

      {/* Empty State */}
      {!isLoading && !currentMeal && meals.length === 0 && (
        <EmptyState
          icon={<Sparkles size={48} />}
          title="No meals available"
          description="Import meals from the admin panel to get started"
        />
      )}

      {/* Meal Details Modal */}
      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}
