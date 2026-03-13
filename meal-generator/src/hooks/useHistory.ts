import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyService } from '../services/supabase';
import { useAppStore } from '../stores/useAppStore';

export function useHistory() {
  const user = useAppStore(state => state.user);

  return useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => historyService.getHistory(user!.id),
    enabled: !!user,
    staleTime: 30 * 1000
  });
}

export function useAddToHistory() {
  const queryClient = useQueryClient();
  const user = useAppStore(state => state.user);
  const addToHistory = useAppStore(state => state.addToHistory);

  return useMutation({
    mutationFn: (mealId: string) => historyService.addToHistory(user!.id, mealId),
    onSuccess: (data) => {
      addToHistory(data);
      queryClient.invalidateQueries({ queryKey: ['history'] });
    }
  });
}
