import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { MealCard } from '../components/meal/MealCard';
import { MealDetailsModal } from '../components/meal/MealDetailsModal';
import { EmptyState } from '../components/ui/EmptyState';
import { mealService, historyService } from '../services/mealService';
import { useAppStore } from '../stores/useAppStore';
import type { Meal } from '../types/database';

export const HomePage = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentMeal, lastGeneratedMealId, setCurrentMeal, setLastGeneratedMealId, addToHistory, user } = useAppStore();

  const generateMeal = async () => {
    setLoading(true);
    try {
      const meal = await mealService.getRandomMeal(lastGeneratedMealId || undefined);
      if (meal) {
        setCurrentMeal(meal);
        setLastGeneratedMealId(meal.id);

        // Add to history if user is logged in
        if (user) {
          await historyService.addToHistory(user.id, meal.id);
          addToHistory(meal.id);
        }
      }
    } catch (error) {
      console.error('Failed to generate meal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Your Next Meal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Let AI inspire your culinary journey with random meal suggestions
          </p>

          <Button
            onClick={generateMeal}
            loading={loading}
            size="lg"
            className="shadow-lg hover:shadow-xl"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Random Meal
          </Button>
        </motion.div>

        {/* Meal Display */}
        <div className="mb-12">
          {currentMeal ? (
            <MealCard
              meal={currentMeal}
              onView={() => handleViewDetails(currentMeal)}
            />
          ) : (
            <EmptyState
              title="No meal generated yet"
              description="Click the button above to discover a delicious meal!"
              action={{
                label: 'Generate Meal',
                onClick: generateMeal,
              }}
            />
          )}
        </div>

        {/* Modal */}
        <MealDetailsModal
          meal={selectedMeal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
};
