import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyService } from '@/services/historyService';
import { useAppStore } from '@/stores/useAppStore';

export const useHistory = () => {
  const { user, history, setHistory, addToHistory } = useAppStore();

  const { isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const history = await historyService.getUserHistory(user.id);
      const mealIds = history.map(h => h.meal_id);
      setHistory(mealIds);
      return history;
    },
    enabled: !!user,
  });

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) return null;
      return historyService.addToHistory(user.id, mealId);
    },
    onSuccess: (_, mealId) => {
      if (mealId) {
        addToHistory(mealId);
        queryClient.invalidateQueries({ queryKey: ['history', user?.id] });
      }
    },
  });

  return {
    history,
    isLoading,
    addToHistory: addMutation.mutate,
  };
};
