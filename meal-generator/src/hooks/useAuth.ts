import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { authService } from '@/services/authService';

export const useAuth = () => {
  const { user, setUser } = useAppStore();

  useEffect(() => {
    authService.getCurrentUser().then(setUser);

    const { data } = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [setUser]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
  };
};
