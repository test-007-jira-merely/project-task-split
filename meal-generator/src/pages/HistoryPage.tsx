import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const HistoryPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meal History</h1>
      </AppLayout>
    </ProtectedRoute>
  );
};
