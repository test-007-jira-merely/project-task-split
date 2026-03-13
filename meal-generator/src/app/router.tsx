import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { AppLayout } from '../components/layout/AppLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Spinner } from '../components/ui';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppStore(state => state.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

const HomePage = lazy(() => import('../pages/home/HomePage'));
const IngredientsPage = lazy(() => import('../pages/ingredients/IngredientsPage'));
const FavoritesPage = lazy(() => import('../pages/favorites/FavoritesPage'));
const HistoryPage = lazy(() => import('../pages/history/HistoryPage'));
const AdminPage = lazy(() => import('../pages/admin/AdminPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: 'ingredients',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IngredientsPage />
          </Suspense>
        )
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <FavoritesPage />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <HistoryPage />
            </Suspense>
          </ProtectedRoute>
        )
      }
    ]
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
            <AdminPage />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage />
          </Suspense>
        )
      },
      {
        path: 'signup',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SignUpPage />
          </Suspense>
        )
      }
    ]
  }
]);
