import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button, MealCardSkeleton } from '../../components/ui';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { useMeals, useAddToHistory } from '../../hooks';
import { useAppStore } from '../../stores/useAppStore';
import { getRandomMeal } from '../../utils/matching';
import type { Meal } from '../../types';

export default function HomePage() {
  const { data: meals, isLoading } = useMeals();
  const user = useAppStore(state => state.user);
  const currentMeal = useAppStore(state => state.currentMeal);
  const setCurrentMeal = useAppStore(state => state.setCurrentMeal);
  const lastGeneratedMealId = useAppStore(state => state.lastGeneratedMealId);
  const setLastGeneratedMealId = useAppStore(state => state.setLastGeneratedMealId);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addToHistory = useAddToHistory();

  const handleGenerateMeal = () => {
    if (!meals || meals.length === 0) return;

    const randomMeal = getRandomMeal(meals, lastGeneratedMealId);
    if (randomMeal) {
      setCurrentMeal(randomMeal);
      setLastGeneratedMealId(randomMeal.id);

      if (user) {
        addToHistory.mutate(randomMeal.id);
      }
    }
  };

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (meals && meals.length > 0 && !currentMeal) {
      handleGenerateMeal();
    }
  }, [meals]);

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Discover Your Next Meal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Let AI help you find the perfect recipe based on your available ingredients
        </p>
        <Button
          onClick={handleGenerateMeal}
          size="lg"
          className="mt-6"
          disabled={isLoading || !meals || meals.length === 0}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Random Meal
        </Button>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <MealCardSkeleton />
        ) : currentMeal ? (
          <MealCard meal={currentMeal} onClick={() => handleMealClick(currentMeal)} />
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No meals available. Please add meals in the admin panel.
            </p>
          </div>
        )}
      </div>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
