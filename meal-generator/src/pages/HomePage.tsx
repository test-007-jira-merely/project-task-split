import { AppLayout } from '../components/layout/AppLayout';

export const HomePage = () => {
  return (
    <AppLayout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to MealGen
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Discover your next favorite meal
        </p>
      </div>
    </AppLayout>
  );
};
