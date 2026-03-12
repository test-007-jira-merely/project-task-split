import { Navigate } from 'react-router-dom';
import { ProtectedRouteProps } from '@/components/interfaces';
import useAppStore from '@/stores/useAppStore';
import { ROUTES } from '@/utils/constants';

export function ProtectedRoute({ children, requireAdmin = false, redirectTo = ROUTES.LOGIN }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAppStore();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
