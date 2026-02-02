import React from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super-admin';
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ 
  children, 
  requiredRole = 'admin' 
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(user);
        
        // Check if user is admin or super-admin
        if (userData.role === 'admin' || userData.role === 'super-admin') {
          // If specific role required, check it
          if (requiredRole === 'super-admin' && userData.role !== 'super-admin') {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Verifying access..." />;
  }

  if (!isAuthorized) {
    // Redirect to login or dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
