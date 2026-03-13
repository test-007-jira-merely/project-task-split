import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { MealCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { mealService } from '@/services/mealService';
import { useAuthStore } from '@/stores/useAuthStore';
import { Meal } from '@/types/models';

export default function FavoritesPage() {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      return mealService.removeFavorite(user.id, mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Your Favorites
        </h1>
        <p className="text-lg text-muted-foreground">
          {favorites.length} saved {favorites.length === 1 ? 'recipe' : 'recipes'}
        </p>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <MealCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Favorites Grid */}
      {!isLoading && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            favorite.meal && (
              <MealCard
                key={favorite.id}
                meal={favorite.meal}
                isFavorite
                onFavorite={() => removeFavoriteMutation.mutate(favorite.mealId)}
                onClick={() => setSelectedMeal(favorite.meal!)}
              />
            )
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && favorites.length === 0 && (
        <EmptyState
          icon={<Heart size={48} />}
          title="No favorites yet"
          description="Start adding meals to your favorites to see them here"
        />
      )}

      {/* Meal Details Modal */}
      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}
