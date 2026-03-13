import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

const HomePage = lazy(() => import('../pages/home/HomePage').then(m => ({ default: m.HomePage })));
const IngredientsPage = lazy(() => import('../pages/ingredients/IngredientsPage').then(m => ({ default: m.IngredientsPage })));
const FavoritesPage = lazy(() => import('../pages/favorites/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const HistoryPage = lazy(() => import('../pages/history/HistoryPage').then(m => ({ default: m.HistoryPage })));
const AdminPage = lazy(() => import('../pages/admin/AdminPage').then(m => ({ default: m.AdminPage })));
const Login = lazy(() => import('../pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../pages/auth/Register').then(m => ({ default: m.Register })));

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSkeleton className="w-96 h-96" /></div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSkeleton className="w-96 h-96" /></div>}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <AppLayout><Suspense fallback={<LoadingSkeleton className="w-full h-96" />}><HomePage /></Suspense></AppLayout>,
  },
  {
    path: '/ingredients',
    element: <AppLayout><Suspense fallback={<LoadingSkeleton className="w-full h-96" />}><IngredientsPage /></Suspense></AppLayout>,
  },
  {
    path: '/favorites',
    element: (
      <ProtectedRoute>
        <AppLayout><Suspense fallback={<LoadingSkeleton className="w-full h-96" />}><FavoritesPage /></Suspense></AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <AppLayout><Suspense fallback={<LoadingSkeleton className="w-full h-96" />}><HistoryPage /></Suspense></AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AppLayout><Suspense fallback={<LoadingSkeleton className="w-full h-96" />}><AdminPage /></Suspense></AppLayout>
      </ProtectedRoute>
    ),
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
