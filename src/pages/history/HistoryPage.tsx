import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { MealCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { mealService } from '@/services/mealService';
import { useAuthStore } from '@/stores/useAuthStore';
import { Meal } from '@/types/models';

export default function HistoryPage() {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => user ? mealService.getUserHistory(user.id) : [],
    enabled: !!user,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      const isFav = favorites.some((f) => f.mealId === mealId);
      if (isFav) {
        await mealService.removeFavorite(user.id, mealId);
      } else {
        await mealService.addFavorite(user.id, mealId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const isFavorite = (mealId: string) =>
    favorites.some((f) => f.mealId === mealId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Your History
        </h1>
        <p className="text-lg text-muted-foreground">
          Recently generated meals
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

      {/* History Grid */}
      {!isLoading && history.length > 0 && (
        <div className="space-y-6">
          {history.map((item) => (
            item.meal && (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock size={16} />
                  <span>{formatDate(item.generatedAt)}</span>
                </div>
                <MealCard
                  meal={item.meal}
                  onFavorite={() => toggleFavoriteMutation.mutate(item.mealId)}
                  isFavorite={isFavorite(item.mealId)}
                  onClick={() => setSelectedMeal(item.meal!)}
                />
              </motion.div>
            )
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && history.length === 0 && (
        <EmptyState
          icon={<History size={48} />}
          title="No history yet"
          description="Generate meals to see them appear in your history"
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
