import { useState, useEffect } from 'react';
import { useMealStore } from './store/useMealStore';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import IngredientsTab from './components/IngredientsTab';
import FavoritesTab from './components/FavoritesTab';

type Tab = 'home' | 'ingredients' | 'favorites';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { initializeTheme } = useMealStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'ingredients':
        return <IngredientsTab />;
      case 'favorites':
        return <FavoritesTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTab()}
      </main>

      <footer className="mt-16 py-8 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>Made with ❤️ by MealGen</p>
      </footer>
    </div>
  );
}

export default App;
