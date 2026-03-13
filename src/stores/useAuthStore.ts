import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { authService } from '@/services/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  signIn: async (email, password) => {
    const { user } = await authService.signIn(email, password);
    set({ user: user || null });
  },

  signUp: async (email, password) => {
    const { user } = await authService.signUp(email, password);
    set({ user: user || null });
  },

  signOut: async () => {
    await authService.signOut();
    set({ user: null });
  },

  initialize: async () => {
    try {
      const session = await authService.getSession();
      set({ user: session?.user || null, loading: false });

      authService.onAuthStateChange((session) => {
        set({ user: session?.user || null });
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ loading: false });
    }
  },
}));
