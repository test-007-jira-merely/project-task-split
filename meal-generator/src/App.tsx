import { useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { AppProviders } from './app/providers';
import { AppRouter } from './app/router';

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const { setTheme } = useAppStore.getState();
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
