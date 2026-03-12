import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const FavoritesPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
      </AppLayout>
    </ProtectedRoute>
  );
};
