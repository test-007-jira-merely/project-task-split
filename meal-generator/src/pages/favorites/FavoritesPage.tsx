import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { favorites, isLoading } = useFavorites();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          Your Favorite Meals
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          All your saved recipes in one place
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Favorites Yet"
          description="Start adding meals to your favorites to see them here. Click the heart icon on any meal card to save it."
          action={
            <Button onClick={() => navigate('/')} variant="primary">
              Discover Meals
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((favorite: any) => (
            <MealCard
              key={favorite.id}
              meal={favorite.meals}
              onViewDetails={() => {
                setSelectedMeal(favorite.meals);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FavoritesPage;
