import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase';
import { useAppStore } from '@/stores/useAppStore';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const { user, favorites, setFavorites, addFavorite, removeFavoriteById } = useAppStore();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const favs = await supabaseService.getFavorites(user.id);
      setFavorites(favs);
      return favs;
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      return await supabaseService.addFavorite(user.id, mealId);
    },
    onSuccess: (favorite) => {
      addFavorite(favorite);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Added to favorites');
    },
    onError: () => {
      toast.error('Failed to add favorite');
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      await supabaseService.removeFavorite(user.id, mealId);
      return mealId;
    },
    onSuccess: (mealId) => {
      removeFavoriteById(mealId);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Removed from favorites');
    },
    onError: () => {
      toast.error('Failed to remove favorite');
    },
  });

  const isFavorite = (mealId: string) => {
    return favorites.some(f => f.meal_id === mealId);
  };

  const toggleFavorite = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeMutation.mutate(mealId);
    } else {
      addMutation.mutate(mealId);
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    addToFavorites: addMutation.mutate,
    removeFromFavorites: removeMutation.mutate,
  };
};
