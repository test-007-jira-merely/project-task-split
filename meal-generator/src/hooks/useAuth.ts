import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import useAppStore from '@/stores/useAppStore';
import { QUERY_KEYS } from '@/utils/constants';

export function useAuth() {
  const { user, setUser, logout: logoutStore } = useAppStore();
  const queryClient = useQueryClient();

  // Initialize auth state
  useEffect(() => {
    authService.getCurrentUser()
      .then(user => setUser(user))
      .catch(() => setUser(null));
  }, [setUser]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: async () => {
      const user = await authService.getCurrentUser();
      setUser(user);
      queryClient.invalidateQueries();
    },
  });

  const signupMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signUp(email, password),
    onSuccess: async () => {
      const user = await authService.getCurrentUser();
      setUser(user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending,
  };
}
