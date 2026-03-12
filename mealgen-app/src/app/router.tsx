import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useAuth } from '@/hooks/useAuth';

const HomePage = lazy(() => import('@/pages/home/HomePage'));
const IngredientsPage = lazy(() => import('@/pages/ingredients/IngredientsPage'));
const FavoritesPage = lazy(() => import('@/pages/favorites/FavoritesPage'));
const HistoryPage = lazy(() => import('@/pages/history/HistoryPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminMealsPage = lazy(() => import('@/pages/admin/AdminMealsPage'));
const AdminImportPage = lazy(() => import('@/pages/admin/AdminImportPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/ingredients',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IngredientsPage />
          </Suspense>
        ),
      },
      {
        path: '/favorites',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <FavoritesPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/history',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <HistoryPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: 'meals',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminMealsPage />
          </Suspense>
        ),
      },
      {
        path: 'import',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminImportPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SignupPage />
      </Suspense>
    ),
  },
]);
