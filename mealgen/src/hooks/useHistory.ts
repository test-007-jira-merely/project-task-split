import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyService } from '@/services/historyService';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect } from 'react';

export function useHistory() {
  const queryClient = useQueryClient();
  const user = useAppStore(state => state.user);
  const setHistory = useAppStore(state => state.setHistory);

  const { data: history = [] } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => historyService.getHistory(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (history) {
      setHistory(history);
    }
  }, [history, setHistory]);

  const addMutation = useMutation({
    mutationFn: (mealId: string) => historyService.addToHistory(user!.id, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history', user?.id] });
    },
  });

  return {
    history,
    addToHistory: addMutation.mutate,
    isLoading: addMutation.isPending,
  };
}
