import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppStore } from '@/stores/useAppStore';
import { getAllMeals, getRandomMeal } from '@/services/mealService';
import { addFavorite, removeFavorite, addToHistory } from '@/services/supabaseData';
import { Meal } from '@/types/meal';

export const HomePage = () => {
  const { user, currentMeal, setCurrentMeal, lastGeneratedMealId, favorites, addFavorite: addFavoriteStore, removeFavorite: removeFavoriteStore, addToHistory: addToHistoryStore } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: allMeals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: getAllMeals,
  });

  const handleGenerateMeal = async () => {
    setIsGenerating(true);

    try {
      const excludeIds = lastGeneratedMealId ? [lastGeneratedMealId] : [];
      const meal = await getRandomMeal(excludeIds);

      if (meal) {
        setCurrentMeal(meal);

        if (user) {
          await addToHistory(user.id, meal.id);
          addToHistoryStore(meal.id);
        }
      }
    } catch (error) {
      console.error('Failed to generate meal:', error);
    } finally {
      setTimeout(() => setIsGenerating(false), 300);
    }
  };

  const handleFavorite = async (mealId: string) => {
    if (!user) return;

    try {
      if (favorites.includes(mealId)) {
        await removeFavorite(user.id, mealId);
        removeFavoriteStore(mealId);
      } else {
        await addFavorite(user.id, mealId);
        addFavoriteStore(mealId);
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Discover Your Next Meal
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Let AI inspire your culinary journey with personalized meal suggestions
        </p>

        <Button
          onClick={handleGenerateMeal}
          isLoading={isGenerating}
          size="lg"
          className="shadow-2xl"
        >
          {isGenerating ? (
            <>
              <Sparkles className="animate-spin" size={24} />
              <span className="ml-2">Generating...</span>
            </>
          ) : (
            <>
              <Shuffle size={24} />
              <span className="ml-2">Generate Meal</span>
            </>
          )}
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <LoadingSkeleton type="card" />
        ) : currentMeal ? (
          <motion.div
            key={currentMeal.id}
            initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <MealCard
              meal={currentMeal}
              isFavorite={favorites.includes(currentMeal.id)}
              onFavorite={() => handleFavorite(currentMeal.id)}
              onRemoveFavorite={() => handleFavorite(currentMeal.id)}
              onClick={() => setSelectedMeal(currentMeal)}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Sparkles size={64} className="mx-auto text-muted-foreground opacity-50 mb-4" />
            <p className="text-xl text-muted-foreground">
              Click the button above to discover a delicious meal!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        isFavorite={selectedMeal ? favorites.includes(selectedMeal.id) : false}
        onFavorite={selectedMeal ? () => handleFavorite(selectedMeal.id) : undefined}
      />
    </div>
  );
};
