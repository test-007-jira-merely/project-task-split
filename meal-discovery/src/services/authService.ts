import { supabase } from './supabase';
import { AuthCredentials, User, Session } from '@/types';
import { IAuthService } from '@/types/services';

class AuthService implements IAuthService {
  async signUp(credentials: AuthCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Signup failed');

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      },
      session: {
        user: {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        },
        access_token: data.session.access_token,
      },
    };
  }

  async signIn(credentials: AuthCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Sign in failed');

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      },
      session: {
        user: {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        },
        access_token: data.session.access_token,
      },
    };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
    };
  }

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at,
      },
      access_token: session.access_token,
    };
  }
}

export const authService = new AuthService();
