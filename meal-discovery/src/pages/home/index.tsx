import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { AnimatedContainer } from '@/components/AnimatedContainer';
import { useMeals } from '@/hooks/useMeals';
import { useFavorites } from '@/hooks/useFavorites';
import { useHistory } from '@/hooks/useHistory';
import { useAppStore } from '@/stores/useAppStore';
import { generateRandomMeal } from '@/utils/mealGenerator';
import { Meal } from '@/types';
import { Shuffle } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const Home = () => {
  const { data: meals, isLoading } = useMeals();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToHistory } = useHistory();
  const { currentMeal, lastGeneratedMealId, setCurrentMeal, setLastGeneratedMealId } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const handleGenerate = () => {
    if (!meals || meals.length === 0) return;

    const meal = generateRandomMeal(meals, lastGeneratedMealId);
    if (meal) {
      setCurrentMeal(meal);
      setLastGeneratedMealId(meal.id);
      addToHistory(meal.id);
    }
  };

  const handleToggleFavorite = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <LoadingSkeleton type="card" count={1} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedContainer animation="fade">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Discover Your Next Meal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Get instant meal inspiration with just one click
          </p>
          <Button
            size="lg"
            onClick={handleGenerate}
            className="shadow-lg hover:shadow-xl"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Generate Random Meal
          </Button>
        </div>

        {/* Meal Display */}
        {currentMeal && (
          <AnimatedContainer animation="scale" delay={0.1}>
            <div className="max-w-2xl mx-auto">
              <MealCard
                meal={currentMeal}
                onFavorite={handleToggleFavorite}
                onViewDetails={setSelectedMeal}
                isFavorite={isFavorite(currentMeal.id)}
                showActions
              />
            </div>
          </AnimatedContainer>
        )}

        {!currentMeal && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-3xl flex items-center justify-center">
              <Shuffle className="w-12 h-12 text-primary-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Click the button above to generate your first meal!
            </p>
          </div>
        )}
      </AnimatedContainer>

      {/* Meal Details Modal */}
      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={handleToggleFavorite}
        isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
};

export default Home;
