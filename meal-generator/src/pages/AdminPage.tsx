import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const AdminPage = () => {
  return (
    <ProtectedRoute requireAdmin>
      <AppLayout>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      </AppLayout>
    </ProtectedRoute>
  );
};
