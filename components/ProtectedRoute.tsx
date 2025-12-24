
import React from 'react';
// Fix: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = ReactRouterDOM.useLocation();

  if (!isAuthenticated) {
    return <ReactRouterDOM.Navigate to="/login" state={{ from: location }} replace />;
  }

  return <ReactRouterDOM.Outlet />;
};

export default ProtectedRoute;
