import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { authService } from '@/services/authService';

const AuthContext = createContext<{}>({});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading } = useAppStore();

  useEffect(() => {
    setLoading(true);

    // Check current session
    authService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
