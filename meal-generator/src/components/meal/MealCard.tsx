import { motion } from 'framer-motion';
import { Clock, ChefHat, Heart } from 'lucide-react';
import type { Meal } from '../../types';
import { Button } from '../ui/Button';
import { useAppStore } from '../../stores/useAppStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '../../services/favoritesService';

interface MealCardProps {
  meal: Meal;
  matchPercentage?: number;
  onViewDetails?: () => void;
}

export const MealCard = ({ meal, matchPercentage, onViewDetails }: MealCardProps) => {
  const user = useAppStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: isFavorited = false } = useQuery({
    queryKey: ['favorite', user?.id, meal.id],
    queryFn: () => favoritesService.isFavorite(user!.id, meal.id),
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      if (isFavorited) {
        await favoritesService.removeFavorite(user.id, meal.id);
      } else {
        await favoritesService.addFavorite(user.id, meal.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite', user?.id, meal.id] });
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const categoryColors = {
    breakfast: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    lunch: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    dinner: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    snack: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {matchPercentage !== undefined && matchPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
            {matchPercentage}% Match
          </div>
        )}
        {user && (
          <motion.button
            onClick={() => toggleFavoriteMutation.mutate()}
            className="absolute top-4 left-4 p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={toggleFavoriteMutation.isPending}
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorited
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400'
              }`}
            />
          </motion.button>
        )}
        <div className="absolute bottom-4 left-4">
          <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${categoryColors[meal.category]}`}>
            {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{meal.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {meal.description}
        </p>

        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <ChefHat className="w-4 h-4" />
            <span>{meal.ingredients.length} ingredients</span>
          </div>
          {meal.prepTime && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{meal.prepTime} min</span>
            </div>
          )}
        </div>

        {onViewDetails && (
          <Button onClick={onViewDetails} variant="primary" className="w-full">
            View Recipe
          </Button>
        )}
      </div>
    </motion.div>
  );
};
