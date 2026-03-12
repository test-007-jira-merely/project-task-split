import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyService } from '@/services/historyService';
import { QUERY_KEYS } from '@/utils/constants';
import useAppStore from '@/stores/useAppStore';

export function useHistory() {
  const { user } = useAppStore();

  return useQuery({
    queryKey: [QUERY_KEYS.history, user?.id],
    queryFn: () => user ? historyService.getHistory(user.id) : [],
    enabled: !!user,
  });
}

export function useAddHistory() {
  const queryClient = useQueryClient();
  const { user, addHistoryEntry } = useAppStore();

  return useMutation({
    mutationFn: (mealId: string) => {
      if (!user) throw new Error('User not authenticated');
      return historyService.addHistoryEntry(user.id, mealId);
    },
    onSuccess: (entry) => {
      addHistoryEntry(entry);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.history] });
    },
  });
}
