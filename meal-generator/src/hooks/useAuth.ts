import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { authService } from '@/services/authService';

export function useAuth() {
  const { user, setUser } = useAppStore();

  useEffect(() => {
    // Check current session
    authService.getCurrentUser().then(setUser);

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(setUser);

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return { user };
}
