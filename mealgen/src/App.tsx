import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Providers } from '@/app/providers';
import { AppRouter } from '@/app/router';
import { authService } from '@/services/authService';
import { useAppStore } from '@/stores/useAppStore';

function App() {
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    // Initialize auth state on mount
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Failed to get current user:', error);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const subscription = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <BrowserRouter>
      <Providers>
        <AppRouter />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
