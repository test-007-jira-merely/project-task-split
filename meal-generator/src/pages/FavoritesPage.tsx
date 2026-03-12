import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { MealCard } from '../components/meal/MealCard';
import { MealDetailsModal } from '../components/meal/MealDetailsModal';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/Loading';
import { useAppStore } from '../stores/useAppStore';
import { mealService, favoriteService } from '../services/mealService';
import type { Meal } from '../types/database';

const FavoritesPageContent = () => {
  const { user, setFavorites } = useAppStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const favoriteIds = await favoriteService.getUserFavorites(user.id);
        setFavorites(favoriteIds);

        const mealPromises = favoriteIds.map((id) => mealService.getMealById(id));
        const mealsData = await Promise.all(mealPromises);
        setMeals(mealsData.filter((m) => m !== null) as Meal[]);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, setFavorites]);

  const handleViewDetails = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Favorites
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your saved meals collection
          </p>
        </div>

        {meals.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-16 w-16" />}
            title="No favorites yet"
            description="Start adding meals to your favorites to see them here!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onView={() => handleViewDetails(meal)} />
            ))}
          </div>
        )}

        <MealDetailsModal
          meal={selectedMeal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
};

export const FavoritesPage = () => {
  return (
    <ProtectedRoute>
      <FavoritesPageContent />
    </ProtectedRoute>
  );
};
