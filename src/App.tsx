import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from './app/layout/AppLayout';

const HomePage = lazy(() => import('./pages/home/HomePage'));
const IngredientsPage = lazy(() => import('./pages/ingredients/IngredientsPage'));
const FavoritesPage = lazy(() => import('./pages/favorites/FavoritesPage'));
const HistoryPage = lazy(() => import('./pages/history/HistoryPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));

// A simple functional component for placeholder UI
const LoadingPlaceholder = ({ pageName }: { pageName: string }) => <div>Loading {pageName}...</div>;

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Suspense fallback={<LoadingPlaceholder pageName="Home" />}><HomePage /></Suspense> },
      { path: '/ingredients', element: <Suspense fallback={<LoadingPlaceholder pageName="Ingredients" />}><IngredientsPage /></Suspense> },
      { path: '/favorites', element: <Suspense fallback={<LoadingPlaceholder pageName="Favorites" />}><FavoritesPage /></Suspense> },
      { path: '/history', element: <Suspense fallback={<LoadingPlaceholder pageName="History" />}><HistoryPage /></Suspense> },
      { path: '/admin', element: <Suspense fallback={<LoadingPlaceholder pageName="Admin" />}><AdminPage /></Suspense> },
      { path: '/auth', element: <Suspense fallback={<LoadingPlaceholder pageName="Auth" />}><AuthPage /></Suspense> },
    ],
  },
]);

export function App() {
    return <RouterProvider router={router} />;
}
