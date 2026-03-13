import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const IngredientsPage = lazy(() => import('@/pages/ingredients/IngredientsPage'));
const FavoritesPage = lazy(() => import('@/pages/favorites/FavoritesPage'));
const HistoryPage = lazy(() => import('@/pages/history/HistoryPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminMeals = lazy(() => import('@/pages/admin/AdminMeals'));
const AdminImport = lazy(() => import('@/pages/admin/AdminImport'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/auth/login" replace />;
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingSkeleton className="w-full h-64" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Suspense fallback={<LoadingFallback />}>
          <HomePage />
        </Suspense>
      </AppLayout>
    ),
  },
  {
    path: '/ingredients',
    element: (
      <AppLayout>
        <Suspense fallback={<LoadingFallback />}>
          <IngredientsPage />
        </Suspense>
      </AppLayout>
    ),
  },
  {
    path: '/favorites',
    element: (
      <AppLayout>
        <Suspense fallback={<LoadingFallback />}>
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        </Suspense>
      </AppLayout>
    ),
  },
  {
    path: '/history',
    element: (
      <AppLayout>
        <Suspense fallback={<LoadingFallback />}>
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        </Suspense>
      </AppLayout>
    ),
  },
  {
    path: '/auth/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/register',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/meals',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <AdminMeals />
          </Suspense>
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/import',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <AdminImport />
          </Suspense>
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
]);
