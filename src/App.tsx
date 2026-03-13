import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">MealGen</h1>
        <p className="text-center text-muted-foreground mt-2">
          Foundation setup complete. UI components will be added in the next subtask.
        </p>
      </div>
    </div>
  );
}

export default App;
