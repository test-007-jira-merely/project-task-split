import { useState, useEffect } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { AnimatedContainer, Button, EmptyState, LoadingSkeleton } from '@/components/ui';
import { MealCard, MealDetailsModal } from '@/components/meal';
import { AppLayout } from '@/components/layout';
import { useMeals } from '@/hooks/useMeals';
import { useAppStore } from '@/stores/useAppStore';
import type { Meal } from '@/types';

export function HomePage() {
  const { data: meals, isLoading } = useMeals();
  const currentMeal = useAppStore((state) => state.currentMeal);
  const generateRandomMeal = useAppStore((state) => state.generateRandomMeal);
  const isFavorite = useAppStore((state) => state.isFavorite);
  const addFavorite = useAppStore((state) => state.addFavorite);
  const removeFavorite = useAppStore((state) => state.removeFavorite);
  const addToHistory = useAppStore((state) => state.addToHistory);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    // Generate random meal on mount if none exists
    if (meals && meals.length > 0 && !currentMeal) {
      generateRandomMeal(meals);
    }
  }, [meals, currentMeal, generateRandomMeal]);

  const handleGenerateMeal = () => {
    if (meals && meals.length > 0) {
      generateRandomMeal(meals);
      if (currentMeal) {
        addToHistory(currentMeal.id);
      }
    }
  };

  const handleToggleFavorite = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  return (
    <AppLayout>
      <AnimatedContainer>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What's for{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              dinner
            </span>
            ?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Let us surprise you with a random meal suggestion
          </p>

          <Button
            onClick={handleGenerateMeal}
            variant="primary"
            size="lg"
            icon={<SparklesIcon className="w-6 h-6" />}
            disabled={isLoading || !meals}
          >
            Generate Random Meal
          </Button>
        </div>

        {/* Current Meal Display */}
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <LoadingSkeleton count={1} height="h-96" />
          ) : currentMeal ? (
            <MealCard
              meal={currentMeal}
              onFavorite={() => handleToggleFavorite(currentMeal.id)}
              isFavorite={isFavorite(currentMeal.id)}
              onClick={() => setSelectedMeal(currentMeal)}
              showActions
            />
          ) : (
            <EmptyState
              icon={<SparklesIcon className="w-16 h-16" />}
              title="No meal generated yet"
              description="Click the button above to get your first random meal suggestion!"
            />
          )}
        </div>

        {/* Meal Details Modal */}
        <MealDetailsModal
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onFavorite={
            selectedMeal ? () => handleToggleFavorite(selectedMeal.id) : undefined
          }
          isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
        />
      </AnimatedContainer>
    </AppLayout>
  );
}
