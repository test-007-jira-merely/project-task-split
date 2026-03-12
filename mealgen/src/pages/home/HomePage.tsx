import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { useMeals } from '@/hooks/useMeals';
import { useFavorites } from '@/hooks/useFavorites';
import { useHistory } from '@/hooks/useHistory';
import { useAppStore } from '@/stores/useAppStore';
import { SparklesIcon } from '@heroicons/react/24/outline';
import type { Meal } from '@/types';

export function HomePage() {
  const { data: meals = [] } = useMeals();
  const { addFavorite, removeFavorite } = useFavorites();
  const { addToHistory } = useHistory();
  const currentMeal = useAppStore(state => state.currentMeal);
  const generateRandomMeal = useAppStore(state => state.generateRandomMeal);
  const user = useAppStore(state => state.user);
  const isFavorite = useAppStore(state => state.isFavorite);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const handleGenerate = () => {
    if (meals.length > 0) {
      generateRandomMeal(meals);
      if (user && currentMeal) {
        addToHistory(currentMeal.id);
      }
    }
  };

  const handleFavoriteToggle = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  return (
    <AppLayout>
      <AnimatedContainer className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Discover Your Next Meal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Let AI-powered suggestions inspire your culinary journey
          </p>

          <Button
            onClick={handleGenerate}
            size="lg"
            icon={<SparklesIcon className="w-6 h-6" />}
            className="shadow-2xl"
          >
            Generate Random Meal
          </Button>
        </div>

        {currentMeal ? (
          <AnimatedContainer>
            <MealCard
              meal={currentMeal}
              onFavorite={() => handleFavoriteToggle(currentMeal.id)}
              isFavorite={isFavorite(currentMeal.id)}
              onClick={() => setSelectedMeal(currentMeal)}
              showActions={!!user}
            />
          </AnimatedContainer>
        ) : (
          <EmptyState
            title="No meal generated yet"
            description="Click the button above to discover a delicious meal"
            icon={<SparklesIcon className="w-16 h-16" />}
          />
        )}

        <MealDetailsModal
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onFavorite={selectedMeal ? () => handleFavoriteToggle(selectedMeal.id) : undefined}
          isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
        />
      </AnimatedContainer>
    </AppLayout>
  );
}
