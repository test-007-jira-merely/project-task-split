import { useEffect } from 'react';
import { useAppStore } from '@stores/useAppStore';
import { authService } from '@services/authService';

export function useAuth() {
  const { user, setUser, setLoading } = useAppStore();

  useEffect(() => {
    setLoading('auth', true);

    authService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading('auth', false);
    });

    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signUp = async (email: string, password: string) => {
    await authService.signUp(email, password);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    loading: useAppStore((state) => state.loading.auth),
    signIn,
    signUp,
    signOut,
  };
}
