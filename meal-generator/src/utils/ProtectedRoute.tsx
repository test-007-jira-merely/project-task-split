import { Navigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const user = useAppStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(user.email)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
