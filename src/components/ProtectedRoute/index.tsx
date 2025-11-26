import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import ErrorScreen from '@/components/ErrorScreen';
import Loader from '@/components/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireHost?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireHost = false
}: ProtectedRouteProps) => {
  const { data, isLoading } = useUser();
  const { user } = data || {};
  const location = useLocation();

  if (isLoading) return <Loader />;

  if (requireAuth && !user) {
    // Si no tienes ruta /login, redirige al home:
    return <Navigate to="/login" state={{ from: location }} replace />;
    // o: return <Navigate to="/" replace />;
  }

  if (requireHost && !user?.is_host) {
    return (
      <ErrorScreen
        title="Access Denied"
        message="You need host privileges to access this page."
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
