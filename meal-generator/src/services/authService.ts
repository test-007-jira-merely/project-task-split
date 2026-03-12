import { supabase } from './supabase';
import type { User } from '../types/database';
import type { IAuthService, AuthCredentials } from '../types/authService.interface';

export class AuthService implements IAuthService {
  async signUp(credentials: AuthCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    return {
      id: userData.id,
      email: userData.email,
      isAdmin: userData.is_admin,
    };
  }

  async signIn(credentials: AuthCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    return {
      id: userData.id,
      email: userData.email,
      isAdmin: userData.is_admin,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;

    return {
      id: userData.id,
      email: userData.email,
      isAdmin: userData.is_admin,
    };
  }

  async getSession(): Promise<{ user: User | null; isAuthenticated: boolean }> {
    const user = await this.getCurrentUser();
    return {
      user,
      isAuthenticated: user !== null,
    };
  }

  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) return false;
    return data.is_admin;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });

    return () => subscription.unsubscribe();
  }
}

export const authService = new AuthService();
