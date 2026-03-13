import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyService } from '@/services/historyService';
import { useAppStore } from '@/stores/useAppStore';

export function useHistory() {
  const user = useAppStore((state) => state.user);

  return useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => historyService.getUserHistory(user!.id),
    enabled: !!user,
  });
}

export function useAddToHistory() {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);

  return useMutation({
    mutationFn: (mealId: string) => {
      if (!user) throw new Error('User not authenticated');
      return historyService.addToHistory(user.id, mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}
