import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyService } from '../services/historyService';
import { useAppStore } from '../stores/useAppStore';

export const useHistory = () => {
  const user = useAppStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => historyService.getUserHistory(user!.id),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: ({ mealId }: { mealId: string }) =>
      historyService.addToHistory(user!.id, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history', user?.id] });
    },
  });

  return {
    history,
    isLoading,
    addToHistory: addMutation.mutate,
  };
};
