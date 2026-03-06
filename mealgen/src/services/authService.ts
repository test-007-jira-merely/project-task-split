import { supabase } from './supabase';
import type { User } from '@/types';

export const authService = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // @ts-expect-error - Supabase type inference issue
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        is_admin: false,
      });
    }

    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!userData) return null;

    return {
      // @ts-expect-error - Supabase type inference issue
      id: userData.id,
      // @ts-expect-error - Supabase type inference issue
      email: userData.email,
      // @ts-expect-error - Supabase type inference issue
      created_at: userData.created_at,
      // @ts-expect-error - Supabase type inference issue
      is_admin: userData.is_admin,
    };
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await authService.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};
