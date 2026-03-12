import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { IngredientsPage } from '../pages/IngredientsPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { HistoryPage } from '../pages/HistoryPage';
import { AdminPage } from '../pages/AdminPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/ingredients',
    element: <IngredientsPage />,
  },
  {
    path: '/favorites',
    element: <FavoritesPage />,
  },
  {
    path: '/history',
    element: <HistoryPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/signup',
    element: <SignupPage />,
  },
]);
