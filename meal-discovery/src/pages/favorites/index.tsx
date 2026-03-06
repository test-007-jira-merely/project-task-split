import { useState } from 'react';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { AnimatedContainer } from '@/components/AnimatedContainer';
import { EmptyState } from '@/components/EmptyState';
import { useMeals } from '@/hooks/useMeals';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { getMealsByIds } from '@/utils/mealGenerator';
import { Meal } from '@/types';
import { Heart } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: meals, isLoading: mealsLoading } = useMeals();
  const { favorites, removeFavorite, isLoading: favoritesLoading } = useFavorites();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  if (!user) {
    return (
      <EmptyState
        icon={<Heart className="w-16 h-16" />}
        title="Sign in to save favorites"
        description="Create an account to save your favorite meals"
        action={{
          label: 'Sign In',
          onClick: () => navigate('/auth/login'),
        }}
      />
    );
  }

  if (mealsLoading || favoritesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  const favoriteMeals = meals ? getMealsByIds(meals, favorites) : [];

  return (
    <div>
      <AnimatedContainer animation="fade">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Favorite Meals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favoriteMeals.length} saved meal{favoriteMeals.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favoriteMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteMeals.map((meal, index) => (
              <AnimatedContainer key={meal.id} animation="slide" delay={index * 0.05}>
                <MealCard
                  meal={meal}
                  onFavorite={removeFavorite}
                  onViewDetails={setSelectedMeal}
                  isFavorite={true}
                  showActions
                />
              </AnimatedContainer>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="w-16 h-16" />}
            title="No favorites yet"
            description="Start exploring meals and save your favorites here"
            action={{
              label: 'Discover Meals',
              onClick: () => navigate('/'),
            }}
          />
        )}
      </AnimatedContainer>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={removeFavorite}
        isFavorite={true}
      />
    </div>
  );
};

export default Favorites;
