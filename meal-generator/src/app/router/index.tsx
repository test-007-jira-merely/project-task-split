import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { MealCardSkeleton } from '@/components/ui/LoadingSkeleton';

const HomePage = lazy(() => import('@/pages/home/HomePage'));
const IngredientsPage = lazy(() => import('@/pages/ingredients/IngredientsPage'));
const FavoritesPage = lazy(() => import('@/pages/favorites/FavoritesPage'));
const HistoryPage = lazy(() => import('@/pages/history/HistoryPage'));
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));

function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto">
      <MealCardSkeleton />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/ingredients" element={<AppLayout><IngredientsPage /></AppLayout>} />

          <Route
            path="/favorites"
            element={
              <AppLayout>
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          <Route
            path="/history"
            element={
              <AppLayout>
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          <Route
            path="/admin"
            element={
              <AppLayout>
                <ProtectedRoute requireAdmin>
                  <AdminPage />
                </ProtectedRoute>
              </AppLayout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
