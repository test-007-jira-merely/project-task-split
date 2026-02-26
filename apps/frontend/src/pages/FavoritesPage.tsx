import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { DishCard } from '@/components/dish/DishCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, isLoading } = useFavorites();

  // Fetch full dish details for each favorite
  const { data: dishes } = useQuery({
    queryKey: ['favorite-dishes', favorites.map(f => f.dishId)],
    queryFn: async () => {
      const dishPromises = favorites.map(f => apiClient.getDishById(f.dishId));
      return Promise.all(dishPromises);
    },
    enabled: favorites.length > 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Your Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Your Favorites</h1>
        <p className="text-muted text-lg">
          All the dishes you've loved, in one place ({favorites.length} {favorites.length === 1 ? 'dish' : 'dishes'})
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Favorites Yet"
          description="Start exploring and heart the dishes you love to see them here"
          action={{
            label: 'Explore Recipes',
            onClick: () => navigate('/explore'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes?.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DishCard dish={dish} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
