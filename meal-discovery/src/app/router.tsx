import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';

// Lazy load pages
const Home = lazy(() => import('@/pages/home'));
const Ingredients = lazy(() => import('@/pages/ingredients'));
const Favorites = lazy(() => import('@/pages/favorites'));
const History = lazy(() => import('@/pages/history'));
const Admin = lazy(() => import('@/pages/admin'));

const PageLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <LoadingSkeleton type="card" count={6} />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/auth',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
  {
    path: '/',
    element: <AppLayout><Suspense fallback={<PageLoader />}><Home /></Suspense></AppLayout>,
  },
  {
    path: '/ingredients',
    element: <AppLayout><Suspense fallback={<PageLoader />}><Ingredients /></Suspense></AppLayout>,
  },
  {
    path: '/favorites',
    element: <AppLayout><Suspense fallback={<PageLoader />}><Favorites /></Suspense></AppLayout>,
  },
  {
    path: '/history',
    element: <AppLayout><Suspense fallback={<PageLoader />}><History /></Suspense></AppLayout>,
  },
  {
    path: '/admin',
    element: <AppLayout><Suspense fallback={<PageLoader />}><Admin /></Suspense></AppLayout>,
  },
]);
