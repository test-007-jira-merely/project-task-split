import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAppStore } from '@/stores/useAppStore';

export default function AppLayout() {
  const { loadMeals, setLoadingMeals } = useAppStore();

  useEffect(() => {
    // Load meals from local JSON on mount
    const loadLocalMeals = async () => {
      try {
        setLoadingMeals(true);
        const response = await fetch('/data/meals.json');
        const data = await response.json();
        loadMeals(data);
      } catch (error) {
        console.error('Failed to load meals:', error);
      } finally {
        setLoadingMeals(false);
      }
    };

    loadLocalMeals();
  }, [loadMeals, setLoadingMeals]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
