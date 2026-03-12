import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/stores/useAppStore';
import { mealService, favoritesService, historyService } from '@/services/supabase';

export default function HomePage() {
  const {
    user,
    currentMeal,
    setCurrentMeal,
    lastGeneratedMealId,
    setLastGeneratedMealId,
    favorites,
    addFavorite,
    removeFavorite,
    addToHistory,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGenerateMeal = async () => {
    setLoading(true);
    try {
      const meal = await mealService.getRandomMeal(lastGeneratedMealId || undefined);
      setCurrentMeal(meal);
      setLastGeneratedMealId(meal.id);

      if (user) {
        await historyService.addToHistory(user.id, meal.id);
        addToHistory(meal.id);
      }
    } catch (error) {
      console.error('Error generating meal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user || !currentMeal) return;

    try {
      const isFav = favorites.includes(currentMeal.id);
      if (isFav) {
        await favoritesService.removeFavorite(user.id, currentMeal.id);
        removeFavorite(currentMeal.id);
      } else {
        await favoritesService.addFavorite(user.id, currentMeal.id);
        addFavorite(currentMeal.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedContainer>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Discover Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Delicious Meal
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Get instant meal inspiration with just one click
          </p>

          <button
            onClick={handleGenerateMeal}
            disabled={loading}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-2xl text-lg font-semibold transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            <Sparkles className="w-6 h-6" />
            {loading ? 'Generating...' : 'Generate Meal'}
          </button>
        </div>

        {/* Meal Display */}
        {currentMeal ? (
          <AnimatedContainer delay={0.2}>
            <MealCard
              meal={currentMeal}
              isFavorite={favorites.includes(currentMeal.id)}
              onFavoriteToggle={user ? handleFavoriteToggle : undefined}
              onClick={() => setShowModal(true)}
            />
          </AnimatedContainer>
        ) : (
          <EmptyState
            title="Ready to discover?"
            description="Click the button above to generate your first meal suggestion"
            icon={<Sparkles className="w-16 h-16" />}
          />
        )}

        {/* Modal */}
        <MealDetailsModal
          meal={currentMeal}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isFavorite={currentMeal ? favorites.includes(currentMeal.id) : false}
          onFavoriteToggle={user ? handleFavoriteToggle : undefined}
        />
      </AnimatedContainer>
    </div>
  );
}
