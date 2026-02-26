import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAppStore } from '@/stores/useAppStore';

export function useHistory(userId?: string, limit?: number) {
  return useQuery({
    queryKey: ['history', userId, limit],
    queryFn: () => apiClient.getHistory(userId, limit),
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();
  const clearHistoryIds = useAppStore((state) => state.clearHistoryIds);

  return useMutation({
    mutationFn: (userId?: string) => apiClient.clearHistory(userId),
    onSuccess: () => {
      clearHistoryIds();
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}
