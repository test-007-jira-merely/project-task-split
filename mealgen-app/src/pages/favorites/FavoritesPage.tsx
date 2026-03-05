import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import MealCard from '@/components/meal/MealCard';
import MealDetailsModal from '@/components/meal/MealDetailsModal';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import type { Meal, MealWithMatch } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const { favorites, isLoading, removeFromFavorites, getFavoriteId } = useFavorites();
  const { meals } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<MealWithMatch | null>(null);
  const navigate = useNavigate();

  const favoriteMeals = favorites
    .map((fav) => meals.find((meal) => meal.id === fav.meal_id))
    .filter((meal): meal is Meal => meal !== undefined);

  const handleFavoriteToggle = (mealId: string) => {
    const favoriteId = getFavoriteId(mealId);
    if (favoriteId) removeFromFavorites(favoriteId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          My Favorites
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {favoriteMeals.length} saved meal{favoriteMeals.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favoriteMeals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favoriteMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onClick={() => setSelectedMeal(meal)}
              onFavoriteToggle={() => handleFavoriteToggle(meal.id)}
              isFavorite={true}
            />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
          title="No favorites yet"
          description="Start adding meals to your favorites to see them here"
          action={{
            label: "Browse Meals",
            onClick: () => navigate('/ingredients'),
          }}
        />
      )}

      {/* Meal Details Modal */}
      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavoriteToggle={
          selectedMeal ? () => handleFavoriteToggle(selectedMeal.id) : undefined
        }
        isFavorite={true}
      />
    </div>
  );
}
