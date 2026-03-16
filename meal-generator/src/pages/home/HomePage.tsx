import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { useAppStore } from '../../stores/useAppStore';
import { useMeals } from '../../hooks/useMeals';
import { useHistory } from '../../hooks/useHistory';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

const HomePage = () => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentMeal, setCurrentMeal, lastGeneratedMealId, setLastGeneratedMealId, user } =
    useAppStore();
  const { data: meals = [], isLoading } = useMeals();
  const { addToHistory } = useHistory();

  const generateRandomMeal = () => {
    if (meals.length === 0) return;

    let availableMeals = meals;
    if (lastGeneratedMealId && meals.length > 1) {
      availableMeals = meals.filter((m) => m.id !== lastGeneratedMealId);
    }

    const randomIndex = Math.floor(Math.random() * availableMeals.length);
    const meal = availableMeals[randomIndex];

    setCurrentMeal(meal);
    setLastGeneratedMealId(meal.id);

    if (user) {
      addToHistory({ mealId: meal.id });
    }
  };

  const handleViewDetails = (meal: any) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
          Discover Your Next Meal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Generate random delicious recipes or find meals based on your available ingredients
        </p>

        <Button
          onClick={generateRandomMeal}
          variant="primary"
          size="lg"
          className="inline-flex items-center space-x-2 text-lg px-8 py-4"
        >
          <Sparkles className="w-6 h-6" />
          <span>Generate Random Meal</span>
        </Button>
      </motion.div>

      {currentMeal && (
        <motion.div
          key={currentMeal.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <MealCard
            meal={currentMeal}
            onViewDetails={() => handleViewDetails(currentMeal)}
          />
        </motion.div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
