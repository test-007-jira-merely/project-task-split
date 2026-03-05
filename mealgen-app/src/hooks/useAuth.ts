import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { supabase, supabaseHelpers } from '@/services/supabase';
import type { User } from '@/types';

export function useAuth() {
  const { user, setUser, logout: logoutStore } = useAppStore();

  useEffect(() => {
    // Check active session
    supabaseHelpers.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabaseHelpers.getUserProfile(session.user.id).then(({ data }) => {
          if (data) {
            setUser(data as User);
          }
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data } = await supabaseHelpers.getUserProfile(session.user.id);
          if (data) {
            setUser(data as User);
          }
        } else if (event === 'SIGNED_OUT') {
          logoutStore();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, logoutStore]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabaseHelpers.signIn(email, password);
    if (error) throw error;
    return data;
  };

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabaseHelpers.signUp(email, password);
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabaseHelpers.signOut();
    logoutStore();
  };

  return { user, login, signup, logout, isAuthenticated: !!user };
}
