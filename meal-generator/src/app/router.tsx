import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { MealCardSkeleton } from '../components/ui/Skeleton'

const HomePage = lazy(() => import('../pages/home/HomePage').then(m => ({ default: m.HomePage })))
const IngredientsPage = lazy(() => import('../pages/ingredients/IngredientsPage').then(m => ({ default: m.IngredientsPage })))
const FavoritesPage = lazy(() => import('../pages/favorites/FavoritesPage').then(m => ({ default: m.FavoritesPage })))
const HistoryPage = lazy(() => import('../pages/history/HistoryPage').then(m => ({ default: m.HistoryPage })))
const AdminPage = lazy(() => import('../pages/admin/AdminPage').then(m => ({ default: m.AdminPage })))
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('../pages/auth/SignupPage').then(m => ({ default: m.SignupPage })))

const LoadingFallback = () => (
  <div className="max-w-3xl mx-auto">
    <MealCardSkeleton />
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/signup',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SignupPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <AppLayout><Suspense fallback={<LoadingFallback />}><HomePage /></Suspense></AppLayout>,
  },
  {
    path: '/ingredients',
    element: <AppLayout><Suspense fallback={<LoadingFallback />}><IngredientsPage /></Suspense></AppLayout>,
  },
  {
    path: '/favorites',
    element: <AppLayout><Suspense fallback={<LoadingFallback />}><FavoritesPage /></Suspense></AppLayout>,
  },
  {
    path: '/history',
    element: <AppLayout><Suspense fallback={<LoadingFallback />}><HistoryPage /></Suspense></AppLayout>,
  },
  {
    path: '/admin',
    element: <AppLayout><Suspense fallback={<LoadingFallback />}><AdminPage /></Suspense></AppLayout>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
