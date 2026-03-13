import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesManager } from '@features/favorites/useFavoritesManager';
import { MealCard } from '@components/meal/MealCard';
import { MealDetailsModal } from '@components/meal/MealDetailsModal';
import { EmptyState } from '@components/ui/EmptyState';
import { LoadingSkeleton } from '@components/ui/LoadingSkeleton';
import { useAuth } from '@hooks/useAuth';
import type { Meal } from '@types/meal';
import { Button } from '@components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function Favorites() {
  const { isAuthenticated } = useAuth();
  const { favorites, isLoading } = useFavoritesManager();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
          title="Sign in to save favorites"
          description="Create an account to save your favorite meals and access them anytime"
          action={<Button onClick={() => navigate('/login')}>Sign In</Button>}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">My Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">My Favorites</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {favorites.length} saved {favorites.length === 1 ? 'meal' : 'meals'}
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((meal) => (
            <MealCard key={meal.id} meal={meal} onClick={() => setSelectedMeal(meal)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
          title="No favorites yet"
          description="Start adding meals to your favorites by clicking the heart icon"
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}
