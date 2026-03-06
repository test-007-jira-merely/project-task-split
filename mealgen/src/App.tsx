import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Providers } from './app/providers';
import { AppRouter } from './app/router';
import { useTheme } from './hooks/useTheme';
import { useAppStore } from './stores/useAppStore';
import { authService } from './services/authService';

function AppContent() {
  useTheme();
  const setUser = useAppStore(state => state.setUser);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);

    const { data } = authService.onAuthStateChange(setUser);
    return () => {
      data.subscription.unsubscribe();
    };
  }, [setUser]);

  return <AppRouter />;
}

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppContent />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
