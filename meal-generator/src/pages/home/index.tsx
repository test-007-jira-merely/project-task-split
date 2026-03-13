import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { mealService } from '../../services/mealService';
import { useAppStore } from '../../stores/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { MealCardSkeleton } from '../../components/ui/LoadingSkeleton';

export function Home() {
  const { user } = useAuth();
  const {
    currentMeal,
    setCurrentMeal,
    lastGeneratedMealId,
    setLastGeneratedMealId,
    addFavorite,
    removeFavorite,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: () => mealService.getAllMeals(),
  });

  const { data: userFavorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const generateRandomMeal = async () => {
    if (meals.length === 0) return;

    setGenerating(true);

    // Filter out last generated meal
    const availableMeals = meals.filter(m => m.id !== lastGeneratedMealId);
    const mealPool = availableMeals.length > 0 ? availableMeals : meals;

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const randomIndex = Math.floor(Math.random() * mealPool.length);
    const selectedMeal = mealPool[randomIndex];

    setCurrentMeal(selectedMeal);
    setLastGeneratedMealId(selectedMeal.id);

    // Add to history if user is logged in
    if (user) {
      await mealService.addToHistory(user.id, selectedMeal.id);
    }

    setGenerating(false);
  };

  const handleToggleFavorite = async () => {
    if (!user || !currentMeal) return;

    const isFavorite = userFavorites.some(f => f.mealId === currentMeal.id);

    if (isFavorite) {
      await mealService.removeFavorite(user.id, currentMeal.id);
      removeFavorite(currentMeal.id);
    } else {
      const favorite = await mealService.addFavorite(user.id, currentMeal.id);
      addFavorite(favorite);
    }
  };

  const isFavorite = currentMeal ? userFavorites.some(f => f.mealId === currentMeal.id) : false;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Discover Your Next Meal
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Generate random delicious meals with a single click
        </p>

        <Button
          onClick={generateRandomMeal}
          loading={generating}
          disabled={isLoading}
          size="lg"
          className="px-12"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Meal
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="max-w-2xl mx-auto">
          <MealCardSkeleton />
        </div>
      ) : currentMeal ? (
        <motion.div
          key={currentMeal.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <MealCard
            meal={currentMeal}
            onViewDetails={() => setIsModalOpen(true)}
            onToggleFavorite={user ? handleToggleFavorite : undefined}
            isFavorite={isFavorite}
          />
        </motion.div>
      ) : null}

      <MealDetailsModal
        meal={currentMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleFavorite={user ? handleToggleFavorite : undefined}
        isFavorite={isFavorite}
      />
    </div>
  );
}
