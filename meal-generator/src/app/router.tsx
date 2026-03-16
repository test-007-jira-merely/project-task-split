import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ProtectedRoute } from '../utils/ProtectedRoute';

const HomePage = lazy(() => import('../pages/home/HomePage'));
const IngredientsPage = lazy(() => import('../pages/ingredients/IngredientsPage'));
const FavoritesPage = lazy(() => import('../pages/favorites/FavoritesPage'));
const HistoryPage = lazy(() => import('../pages/history/HistoryPage'));
const AdminPage = lazy(() => import('../pages/admin/AdminPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/signup',
    element: (
      <SuspenseWrapper>
        <SignupPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'ingredients',
        element: (
          <SuspenseWrapper>
            <IngredientsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <FavoritesPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <HistoryPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute adminOnly>
            <SuspenseWrapper>
              <AdminPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
