import { supabase } from './supabase';
import type { User } from '@/types';

export const authService = {
  async signUp(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');

    // Wait a bit for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    const profile = await this.getUserProfile(data.user.id);
    if (!profile) throw new Error('Profile creation failed');

    return profile;
  },

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');

    const profile = await this.getUserProfile(data.user.id);
    if (!profile) throw new Error('Profile not found');

    return profile;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return await this.getUserProfile(session.user.id);
  },

  async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    if (!data) return null;

    const user: any = data;
    return {
      id: user.id as string,
      email: user.email as string,
      role: user.role as 'user' | 'admin',
      createdAt: user.created_at as string,
    };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id);
        callback(profile);
      } else {
        callback(null);
      }
    });
  },
};
