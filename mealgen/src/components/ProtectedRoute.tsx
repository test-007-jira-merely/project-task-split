import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const user = useAppStore((state) => state.user);

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
