import { supabase } from './supabase';
import type { User } from '@/types';

export const authService = {
  async signUp(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from signup');

    return {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
      is_admin: false,
    };
  },

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from sign in');

    // Fetch user profile to check admin status
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', data.user.id)
      .single();

    return {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
      is_admin: (profile as any)?.is_admin || false,
    };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch user profile to check admin status
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
      is_admin: (profile as any)?.is_admin || false,
    };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // Fetch user profile to check admin status
          const { data: profile } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          callback({
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            is_admin: (profile as any)?.is_admin || false,
          });
        } else {
          callback(null);
        }
      }
    );

    return subscription;
  },
};
