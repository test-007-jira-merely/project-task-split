import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import MealCard from '@/components/meal/MealCard';
import MealDetailsModal from '@/components/meal/MealDetailsModal';
import { useMealGenerator } from '@/features/meal-generator/useMealGenerator';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import type { MealWithMatch } from '@/types';

export default function HomePage() {
  const { currentMeal, generateRandomMeal } = useMealGenerator();
  const { isFavorite, addToFavorites, removeFromFavorites, getFavoriteId } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [selectedMeal, setSelectedMeal] = useState<MealWithMatch | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateRandomMeal();
    setTimeout(() => setIsGenerating(false), 500);
  };

  const handleFavoriteToggle = (mealId: string) => {
    if (!isAuthenticated) return;

    if (isFavorite(mealId)) {
      const favoriteId = getFavoriteId(mealId);
      if (favoriteId) removeFromFavorites(favoriteId);
    } else {
      addToFavorites(mealId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Discover Your Next
          <span className="text-teal-600 dark:text-teal-500"> Favorite Meal</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Generate random meal ideas or find perfect recipes based on the ingredients you have at home.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="min-w-[200px]"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Generate Meal
          </Button>
          <Link to="/ingredients">
            <Button variant="secondary" size="lg">
              Search by Ingredients
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Current Meal */}
      {currentMeal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <MealCard
            meal={currentMeal}
            onClick={() => setSelectedMeal(currentMeal)}
            onFavoriteToggle={
              isAuthenticated
                ? () => handleFavoriteToggle(currentMeal.id)
                : undefined
            }
            isFavorite={isAuthenticated ? isFavorite(currentMeal.id) : false}
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!currentMeal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          <p>Click "Generate Meal" to discover a random recipe!</p>
        </motion.div>
      )}

      {/* Meal Details Modal */}
      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavoriteToggle={
          isAuthenticated && selectedMeal
            ? () => handleFavoriteToggle(selectedMeal.id)
            : undefined
        }
        isFavorite={isAuthenticated && selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
}
