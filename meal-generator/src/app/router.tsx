import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Home } from '../pages/home';
import { Ingredients } from '../pages/ingredients';
import { Favorites } from '../pages/favorites';
import { History } from '../pages/history';
import { Admin } from '../pages/admin';

export const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    ),
  },
  {
    path: '/ingredients',
    element: (
      <AppLayout>
        <Ingredients />
      </AppLayout>
    ),
  },
  {
    path: '/favorites',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Favorites />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <History />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Admin />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
]);
