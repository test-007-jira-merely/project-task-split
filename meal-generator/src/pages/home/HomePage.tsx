import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useMeals } from '@/hooks/useMeals';
import { useAddToHistory } from '@/hooks/useHistory';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/Button';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Meal } from '@/types';

export function HomePage() {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: meals = [], isLoading } = useMeals();
  const addToHistory = useAddToHistory();
  const user = useAppStore((state) => state.user);
  const { lastGeneratedMealId, setLastGeneratedMealId } = useAppStore();

  const generateRandomMeal = () => {
    if (meals.length === 0) return;

    let availableMeals = meals;

    // Exclude last generated meal if possible
    if (meals.length > 1 && lastGeneratedMealId) {
      availableMeals = meals.filter((m) => m.id !== lastGeneratedMealId);
    }

    const randomIndex = Math.floor(Math.random() * availableMeals.length);
    const meal = availableMeals[randomIndex];

    setSelectedMeal(meal);
    setLastGeneratedMealId(meal.id);

    // Add to history if user is logged in
    if (user) {
      addToHistory.mutate(meal.id);
    }
  };

  const handleCardClick = () => {
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Discover Your Next Meal
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get inspired with random meal suggestions or find recipes based on your available
          ingredients
        </p>

        <Button size="lg" onClick={generateRandomMeal} disabled={meals.length === 0}>
          <Shuffle className="w-5 h-5 mr-2" />
          Generate Random Meal
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedMeal ? (
          <motion.div
            key={selectedMeal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <MealCard meal={selectedMeal} onClick={handleCardClick} />
          </motion.div>
        ) : meals.length === 0 ? (
          <EmptyState
            title="No Meals Available"
            description="Please add some meals to get started. Admin users can import meals from the admin panel."
          />
        ) : null}
      </AnimatePresence>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
