import { supabase } from './supabase';
import { User } from '@/types/user';

export const signUp = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  if (!data.user) throw new Error('No user returned');

  return {
    id: data.user.id,
    email: data.user.email!,
    createdAt: data.user.created_at,
  };
};

export const signIn = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  if (!data.user) throw new Error('No user returned');

  return {
    id: data.user.id,
    email: data.user.email!,
    createdAt: data.user.created_at,
  };
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email!,
    createdAt: user.created_at,
  };
};

export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email!,
        createdAt: session.user.created_at,
      });
    } else {
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
};
