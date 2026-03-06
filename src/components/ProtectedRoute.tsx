import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAppStore();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
