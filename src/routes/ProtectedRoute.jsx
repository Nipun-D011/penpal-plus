import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, getRoleHomeRoute } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-4 border-[#131d33] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /login if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is restricted, direct user automatically to their role-specific home route
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHomeRoute(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
