import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { Providers } from './app/providers';
import { useAppStore } from './stores/useAppStore';
import { useTheme } from './hooks/useTheme';
import { getCurrentUser, onAuthStateChange } from './services/supabaseAuth';

function App() {
  const { setUser } = useAppStore();
  useTheme();

  useEffect(() => {
    // Load current user
    getCurrentUser().then(setUser).catch(console.error);

    // Listen to auth changes
    const unsubscribe = onAuthStateChange(setUser);

    return () => unsubscribe();
  }, [setUser]);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
