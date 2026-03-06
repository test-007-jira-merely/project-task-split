import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { authService } from '@/services/authService';
import { supabase } from '@/services/supabase';
import { AuthCredentials } from '@/types';

export const useAuth = () => {
  const { user, setUser } = useAppStore();

  useEffect(() => {
    // Check for existing session on mount
    authService.getCurrentUser().then(user => {
      if (user) setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  const signUp = async (credentials: AuthCredentials) => {
    const { user } = await authService.signUp(credentials);
    setUser(user);
    return user;
  };

  const signIn = async (credentials: AuthCredentials) => {
    const { user } = await authService.signIn(credentials);
    setUser(user);
    return user;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return {
    user,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};
