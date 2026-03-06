import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/home/HomePage';
import { IngredientsPage } from '@/pages/ingredients/IngredientsPage';
import { FavoritesPage } from '@/pages/favorites/FavoritesPage';
import { HistoryPage } from '@/pages/history/HistoryPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/auth',
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
  {
    path: '/',
    element: <AppLayout><HomePage /></AppLayout>,
  },
  {
    path: '/ingredients',
    element: <AppLayout><IngredientsPage /></AppLayout>,
  },
  {
    path: '/favorites',
    element: (
      <AppLayout>
        <ProtectedRoute>
          <FavoritesPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: '/history',
    element: (
      <AppLayout>
        <ProtectedRoute>
          <HistoryPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: '/admin',
    element: (
      <AppLayout>
        <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
