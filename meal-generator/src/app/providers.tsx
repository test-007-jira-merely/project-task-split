import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { router } from './router';
import { useAppStore } from '../stores/useAppStore';
import { authService } from '../services/authService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const AppProviders = () => {
  const { setUser, theme, setTheme } = useAppStore();

  useEffect(() => {
    // Initialize theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!localStorage.getItem('mealgen-storage')) {
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    // Initialize auth
    authService.getCurrentUser().then(({ user }) => {
      if (user) {
        setUser({
          id: user.id,
          email: user.email!,
          created_at: user.created_at!,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (user) {
        setUser({
          id: user.id,
          email: user.email!,
          created_at: user.created_at!,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
