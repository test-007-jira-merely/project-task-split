import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const user = useAppStore(state => state.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
