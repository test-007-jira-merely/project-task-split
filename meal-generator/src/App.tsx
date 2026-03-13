import { useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { ThemeToggle } from './components/layout/ThemeToggle';

function App() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
          MealGen
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
          Foundation setup complete
        </p>
      </div>
    </div>
  );
}

export default App;
