import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase';
import { useAppStore } from '@/stores/useAppStore';

export const useHistory = () => {
  const { user, history, setHistory, addToHistory } = useAppStore();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const hist = await supabaseService.getHistory(user.id);
      setHistory(hist);
      return hist;
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      return await supabaseService.addToHistory(user.id, mealId);
    },
    onSuccess: (item) => {
      addToHistory(item);
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  return {
    history,
    isLoading,
    addToHistory: addMutation.mutate,
  };
};
