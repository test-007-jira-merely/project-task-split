import { supabase } from '../lib/supabase';
import type { User, AuthResponse } from '../types/auth';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Get admin emails from environment variable
function getAdminEmails(): string[] {
  const adminEmailsEnv = import.meta.env.VITE_ADMIN_EMAILS;
  if (!adminEmailsEnv) {
    return [];
  }
  return adminEmailsEnv.split(',').map((email: string) => email.trim().toLowerCase());
}

// Check if a user is an admin based on their email
function isAdminUser(email: string | undefined): boolean {
  if (!email) {
    return false;
  }
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

// Map Supabase user to our User type
function mapSupabaseUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    isAdmin: isAdminUser(supabaseUser.email),
  };
}

// Sign up a new user
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        user: null,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        user: null,
        error: 'Failed to create user',
      };
    }

    return {
      user: mapSupabaseUser(data.user),
    };
  } catch (err) {
    return {
      user: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

// Sign in an existing user
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        user: null,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        user: null,
        error: 'Failed to sign in',
      };
    }

    return {
      user: mapSupabaseUser(data.user),
    };
  } catch (err) {
    return {
      user: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

// Sign out the current user
export async function signOut(): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

// Get the currently authenticated user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return mapSupabaseUser(user);
  } catch (err) {
    console.error('Failed to get current user:', err);
    return null;
  }
}

// Subscribe to authentication state changes
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): { unsubscribe: () => void } {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);

  return {
    unsubscribe: () => subscription.unsubscribe(),
  };
}

// Get current session
export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Failed to get session:', error);
      return null;
    }

    return session;
  } catch (err) {
    console.error('Failed to get session:', err);
    return null;
  }
}
