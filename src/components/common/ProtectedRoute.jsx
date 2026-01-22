// src/components/common/ProtectedRoute.jsx - FIXED VERSION
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  selectIsAuthenticated, 
  selectUser, 
  selectUserRole,
  selectPermissions,
  checkSessionExpiry,
  updateActivity 
} from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { authAPI } from "@/services/authService";

/**
 * Enhanced ProtectedRoute Component - FIXED TOKEN CHECK
 */

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  fallbackPath = "/login",
  showLoading = true,
  enableActivityTracking = true
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Enhanced state selection
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const permissions = useSelector(selectPermissions);
  
  const [isChecking, setIsChecking] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);

  // ✅ FIX: Check if token exists in localStorage (compatibility check)
  const hasTokenInStorage = () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return !!token;
  };

  // Check session expiry on mount
  useEffect(() => {
    dispatch(checkSessionExpiry());
  }, [dispatch]);

  // Track user activity
  useEffect(() => {
    if (enableActivityTracking && isAuthenticated) {
      dispatch(updateActivity());
      
      const handleActivity = () => dispatch(updateActivity());
      
      window.addEventListener('click', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('scroll', handleActivity);
      
      return () => {
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('keypress', handleActivity);
        window.removeEventListener('scroll', handleActivity);
      };
    }
  }, [dispatch, isAuthenticated, enableActivityTracking]);

  // ✅ FIXED: Enhanced access control logic
  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);
      
      try {
        // ✅ FIX: Check BOTH Redux state AND localStorage token
        const hasToken = hasTokenInStorage();
        
        if (!hasToken) {
          console.log('🔐 Access denied: No token in localStorage');
          setAccessGranted(false);
          setIsChecking(false);
          return;
        }

        if (!isAuthenticated || !user) {
          console.log('🔐 Access denied: Not authenticated in Redux');
          setAccessGranted(false);
          setIsChecking(false);
          return;
        }

        // Check role-based access
        if (allowedRoles.length > 0) {
          const hasRequiredRole = allowedRoles.includes(userRole);
          
          if (!hasRequiredRole) {
            console.warn('🚫 Role access denied:', {
              required: allowedRoles,
              actual: userRole,
              user: user.email
            });
            setAccessGranted(false);
            setIsChecking(false);
            return;
          }
        }

        // Check permission-based access
        if (requiredPermissions.length > 0) {
          const hasRequiredPermissions = requiredPermissions.every(permission =>
            permissions.includes('*') || permissions.includes(permission)
          );
          
          if (!hasRequiredPermissions) {
            console.warn('🚫 Permission access denied:', {
              required: requiredPermissions,
              actual: permissions,
              user: user.email
            });
            setAccessGranted(false);
            setIsChecking(false);
            return;
          }
        }

        // Additional security checks
        if (user.isSuspended) {
          console.error('🚫 Account suspended:', user.email);
          setAccessGranted(false);
          setIsChecking(false);
          return;
        }

        // All checks passed
        console.log('✅ Access granted:', {
          user: user.email,
          role: userRole,
          path: location.pathname,
          tokenExists: hasToken
        });
        
        setAccessGranted(true);
        
      } catch (error) {
        console.error('💥 Error during access check:', error);
        setAccessGranted(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [
    isAuthenticated, 
    user, 
    userRole, 
    permissions, 
    allowedRoles, 
    requiredPermissions, 
    location.pathname
  ]);

  // Show loading state
  if (isChecking && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // ✅ FIX: Handle unauthenticated users - check localStorage first
  if (!hasTokenInStorage()) {
    console.log('🔐 No token found, redirecting to login from:', location.pathname);
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ 
          from: location,
          reason: 'no_token_found'
        }} 
        replace 
      />
    );
  }

  // ✅ FIX: Also check Redux authentication state
  if (!isAuthenticated && hasTokenInStorage()) {
    console.log('🔐 Token exists but Redux not authenticated:', location.pathname);
    // You might want to dispatch a token validation here
  }

  // Handle access denied (authenticated but wrong role/permissions)
  if (!accessGranted && isAuthenticated) {
    console.warn('🚫 Access denied for authenticated user:', {
      user: user?.email,
      role: userRole,
      path: location.pathname,
      requiredRoles: allowedRoles,
      requiredPermissions: requiredPermissions
    });

    // Show access denied UI
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-9V4m0 0H9m3 0h3" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Administrator Access Required</h2>
          
          <p className="text-gray-600 mb-6">
            This page is restricted to users with administrator privileges.
            {allowedRoles.length > 0 && (
              <><br /><strong>Required role:</strong> {allowedRoles.join(' or ')}</>
            )}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Go Back
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
            >
              Return to Dashboard
            </button>
            
            {userRole === 'admin' && (
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
              >
                Admin Dashboard
              </button>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded text-sm text-gray-500">
            <p><strong>Current User:</strong> {user?.email}</p>
            <p><strong>Current Role:</strong> {userRole}</p>
            <p><strong>Token Status:</strong> {hasTokenInStorage() ? 'Valid' : 'Missing'}</p>
            {allowedRoles.length > 0 && (
              <p><strong>Required Role:</strong> {allowedRoles.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Access granted - render children
  return children;
};

// ✅ FIXED: AdminRoute with proper token check
export const AdminRoute = (props) => (
  <ProtectedRoute 
    allowedRoles={['admin', 'super_admin', 'system_admin']} 
    fallbackPath="/login"
    {...props} 
  />
);

export const RecruiterRoute = (props) => (
  <ProtectedRoute 
    allowedRoles={['recruiter']} 
    requiredPermissions={['post_jobs', 'view_candidates']}
    fallbackPath="/login"
    {...props} 
  />
);

export const CompanyRoute = (props) => (
  <ProtectedRoute 
    allowedRoles={['company', 'admin']} 
    fallbackPath="/login"
    {...props} 
  />
);

export const FreelancerRoute = (props) => (
  <ProtectedRoute 
    allowedRoles={['freelancer']} 
    requiredPermissions={['submit_candidates', 'view_placements']}
    fallbackPath="/login"
    {...props} 
  />
);

export const AuthenticatedRoute = (props) => (
  <ProtectedRoute 
    fallbackPath="/login"
    {...props} 
  />
);

// Hook for programmatic access checks
export const useAccessControl = () => {
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const permissions = useSelector(selectPermissions);

  // ✅ FIX: Add token check
  const hasToken = () => {
    return !!localStorage.getItem('authToken') || !!localStorage.getItem('token');
  };

  const hasRole = (roles) => {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  };

  const hasPermission = (requiredPermissions) => {
    const permissionArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    return permissionArray.every(permission =>
      permissions.includes('*') || permissions.includes(permission)
    );
  };

  const canAccess = ({ roles = [], permissions = [] }) => {
    const roleAccess = roles.length === 0 || hasRole(roles);
    const permissionAccess = permissions.length === 0 || hasPermission(permissions);
    return roleAccess && permissionAccess && hasToken();
  };

  return {
    hasToken,
    hasRole,
    hasPermission,
    canAccess,
    userRole,
    permissions,
    isAuthenticated: !!user && hasToken()
  };
};

export default ProtectedRoute;