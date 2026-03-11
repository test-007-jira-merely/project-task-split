import { Suspense, lazy } from 'react'
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom'
import AppLayout from '../layout/AppLayout'
import { useAuth } from '../providers/AppProviders'

const HomePage = lazy(() => import('../../pages/HomePage'))
const IngredientsPage = lazy(() => import('../../pages/IngredientsPage'))
const FavoritesPage = lazy(() => import('../../pages/FavoritesPage'))
const HistoryPage = lazy(() => import('../../pages/HistoryPage'))
const AdminPage = lazy(() => import('../../pages/AdminPage'))
const AuthPage = lazy(() => import('../../pages/AuthPage'))

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
    Loading experience...
  </div>
)

const ProtectedRoute = ({ children, requireAdmin }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { session, loading } = useAuth()
  const user = session?.user

  if (loading) return <LoadingFallback />
  if (!user) return <Navigate to="/auth" replace />
  if (requireAdmin && !user.user_metadata?.is_admin) return <Navigate to="/" replace />

  return <>{children}</>
}

const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'ingredients',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IngredientsPage />
          </Suspense>
        ),
      },
      {
        path: 'favorites',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <FavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HistoryPage />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingFallback />}>
              <AdminPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthPage />
      </Suspense>
    ),
  },
]

const router = createBrowserRouter(routes)

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
