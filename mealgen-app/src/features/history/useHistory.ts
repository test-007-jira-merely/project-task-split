import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';
import { supabaseHelpers } from '@/services/supabase';

export function useHistory() {
  const { user, history, setHistory } = useAppStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabaseHelpers.getHistory(user.id);
      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (data) {
      setHistory(data as any);
    }
  }, [data, setHistory]);

  const groupedHistory = history.reduce((acc, entry) => {
    const date = new Date(entry.generated_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey: string;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      groupKey = 'This Week';
    } else {
      groupKey = 'Older';
    }

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(entry);
    return acc;
  }, {} as Record<string, typeof history>);

  return {
    history,
    groupedHistory,
    isLoading,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['history'] }),
  };
}
