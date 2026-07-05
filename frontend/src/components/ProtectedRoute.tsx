import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, isValidToken } from '../store/authStore';
import type { Role } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, accessToken, logout, _hasHydrated } = useAuthStore();
  const location = useLocation();

  // Force logout if token is expired (cleanup side-effect)
  useEffect(() => {
    if (_hasHydrated && isAuthenticated && !isValidToken(accessToken)) {
      logout();
    }
  }, [_hasHydrated, isAuthenticated, accessToken, logout]);

  // Wait until Zustand has rehydrated from localStorage before making any decision.
  // Without this, the component renders with default state (isAuthenticated=false),
  // then rehydrates with stale data, causing a flash or allowing bypass.
  if (!_hasHydrated) {
    return null; // or a loading spinner
  }

  // GATE 1: Must have a valid, non-expired access token
  if (!isAuthenticated || !user || !isValidToken(accessToken)) {
    return <Navigate to="/" replace />;
  }

  // GATE 2: Must have the correct role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's own dashboard based on their actual role
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // All checks passed — render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
