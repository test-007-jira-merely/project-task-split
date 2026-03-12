import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { authService } from '../services/authService';
import { useAppStore } from '../stores/useAppStore';
import { LoadingScreen } from '../components/ui/Loading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setUser } = useAppStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user } = await authService.getSession();
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
