import { useQuery } from '@tanstack/react-query';
import { mealService } from '@services/mealService';
import { useAuth } from '@hooks/useAuth';

export function useHistoryTracker() {
  const { user } = useAuth();

  const { data: history = [], isLoading, error } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => mealService.getHistory(user!.id),
    enabled: !!user,
  });

  return {
    history,
    isLoading,
    error,
  };
}
