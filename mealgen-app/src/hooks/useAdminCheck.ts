import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function useAdminCheck() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  return { isAdmin: user?.is_admin || false };
}
