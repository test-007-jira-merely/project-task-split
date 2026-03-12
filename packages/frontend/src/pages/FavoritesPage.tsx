import { AppLayout } from '@/components/layout/AppLayout';
import { DishCard } from '@/components/dish/DishCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useDishStore } from '@/stores/dish-store';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function FavoritesPage() {
  const { favorites } = useDishStore();
  const navigate = useNavigate();
  const favoriteIds = Array.from(favorites);

  const { data: favoriteDishes, isLoading } = useQuery({
    queryKey: ['favorites', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      const dishes = await Promise.all(
        favoriteIds.map(id => apiClient.getDishById(id))
      );
      return dishes.map((d: any) => d.data);
    },
    enabled: favoriteIds.length > 0,
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Favorites</h1>
          <p className="text-muted-foreground">
            {favoriteIds.length} saved {favoriteIds.length === 1 ? 'dish' : 'dishes'}
          </p>
        </div>

        {isLoading ? (
          <LoadingSkeleton variant="card" count={3} />
        ) : favoriteIds.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            description="Start adding dishes to your favorites by clicking the heart icon"
            icon="💝"
            action={{
              label: 'Discover Dishes',
              onClick: () => navigate('/'),
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {favoriteDishes?.map((dish: any, index: number) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DishCard dish={dish} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
