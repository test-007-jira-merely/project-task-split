import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { useAppStore } from '@/stores/useAppStore';
import { supabaseService } from '@/services/supabase';

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/home/HomePage'));
const IngredientsPage = React.lazy(() => import('@/pages/ingredients/IngredientsPage'));
const FavoritesPage = React.lazy(() => import('@/pages/favorites/FavoritesPage'));
const HistoryPage = React.lazy(() => import('@/pages/history/HistoryPage'));
const AdminPage = React.lazy(() => import('@/pages/admin/AdminPage'));
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = React.lazy(() => import('@/pages/auth/SignupPage'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppStore();
  return user ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppStore();
  return user?.is_admin ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRouter: React.FC = () => {
  const { setUser } = useAppStore();

  useEffect(() => {
    // Check current user on mount
    supabaseService.getCurrentUser().then(setUser);

    // Listen for auth changes
    const unsubscribe = supabaseService.onAuthStateChange(setUser);
    return unsubscribe;
  }, [setUser]);

  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;
