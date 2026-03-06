import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { historyService } from '@/services/historyService';
import { useAppStore } from '@/stores/useAppStore';

export function useHistory() {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);
  const setHistory = useAppStore((state) => state.setHistory);

  const query = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => {
      if (!user) return [];
      return historyService.getHistory(user.id);
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (query.data) {
      setHistory(query.data);
    }
  }, [query.data, setHistory]);

  const addMutation = useMutation({
    mutationFn: (mealId: string) => {
      if (!user) throw new Error('User not authenticated');
      return historyService.addToHistory(user.id, mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history', user?.id] });
    },
  });

  return {
    history: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addToHistory: addMutation.mutate,
    isAddingToHistory: addMutation.isPending,
  };
}
