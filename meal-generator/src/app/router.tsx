import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { HomePage } from '@/pages/home/HomePage';
import { IngredientsPage } from '@/pages/ingredients/IngredientsPage';
import { FavoritesPage } from '@/pages/favorites/FavoritesPage';
import { HistoryPage } from '@/pages/history/HistoryPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'ingredients', element: <IngredientsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'admin', element: <AdminPage /> },
    ],
  },
  {
    path: '/auth',
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
