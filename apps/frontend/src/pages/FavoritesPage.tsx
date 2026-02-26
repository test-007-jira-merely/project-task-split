import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { DishCard } from '@/components/DishCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFavorites } from '@/hooks/useFavorites';

export function FavoritesPage() {
  const { data: favorites, isLoading } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 justify-center mb-4">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <h1 className="text-4xl font-bold">Favorite Recipes</h1>
        </div>
        <p className="text-center text-muted-foreground">
          Your saved recipes collection
        </p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      )}

      {favorites && favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favorites.map((favorite: any) => (
            <DishCard key={favorite.dish.id} dish={favorite.dish} />
          ))}
        </motion.div>
      )}

      {favorites && favorites.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-2xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground">
            Start adding recipes to your favorites by clicking the heart icon
          </p>
        </motion.div>
      )}
    </div>
  );
}
