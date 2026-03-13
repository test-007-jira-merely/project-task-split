import { useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          MealGen
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Foundation setup complete. UI components coming next.
        </p>
      </div>
    </div>
  );
}

export default App;
