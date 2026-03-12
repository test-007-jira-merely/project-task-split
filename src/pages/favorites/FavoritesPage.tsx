import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmptyState, LoadingSkeleton } from '@/components/ui';
import { MealCard, MealDetailsModal } from '@/components/meal';
import { useFavorites } from '@/features/favorites/useFavorites';
import { Meal } from '@/types';
import mealsData from '@/data/meals.json';

const FavoritesPage: React.FC = () => {
  const { favorites, isLoading, isFavorite, toggleFavorite } = useFavorites();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const meals = mealsData as Meal[];
  const favoriteMeals = meals.filter(meal => favorites.some(f => f.meal_id === meal.id));

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-foreground">My Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" height="300px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">My Favorites</h1>
        <p className="text-muted-foreground">
          {favoriteMeals.length} saved meal{favoriteMeals.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favoriteMeals.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-16 w-16" />}
          title="No favorites yet"
          description="Start adding meals to your favorites to see them here"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteMeals.map((meal) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <MealCard
                meal={meal}
                onView={setSelectedMeal}
                onFavorite={toggleFavorite}
                isFavorite={isFavorite(meal.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={toggleFavorite}
        isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
};

export default FavoritesPage;
