// src/context/authContext.jsx - COMPLETE FIXED VERSION
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setCredentials, logoutUser } from "@/redux/authSlice";
import api from "@/services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading, token, isAuthenticated } = useSelector((store) => store.auth);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      console.log("🔄 Initializing auth from localStorage");
      
      // ✅ FIXED: Check BOTH token storage locations
      const storedToken = localStorage.getItem("authToken") || localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      console.log("📦 Storage check:", {
        hasAuthToken: !!localStorage.getItem("authToken"),
        hasToken: !!localStorage.getItem("token"),
        hasUser: !!storedUser
      });
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log("✅ Initializing auth with user:", userData.email, "Role:", userData.role);
          
          dispatch(setCredentials({
            user: userData,
            token: storedToken
          }));
        } catch (error) {
          console.error("❌ Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      } else {
        console.log("⚠️ No stored credentials found");
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      console.log("🔐 Attempting login for:", email);
      
      const response = await api.post("/auth/login", { email, password });
      console.log("📦 Login response received");
      
      if (response.data?.success) {
        // ✅ FIXED: Get data from correct response structure
        const userData = response.data.user || response.data.data?.user || response.data.data;
        const token = response.data.token || response.data.data?.token;
        
        console.log("👤 User data extracted:", {
          hasUserData: !!userData,
          email: userData?.email,
          role: userData?.role,
          hasToken: !!token
        });
        
        if (userData && token) {
          // Save to Redux
          dispatch(setCredentials({ user: userData, token }));
          
          // ✅ FIXED: Save to localStorage with BOTH keys for compatibility
          localStorage.setItem("authToken", token);
          localStorage.setItem("token", token); // Backup for compatibility
          localStorage.setItem("user", JSON.stringify(userData));
          
          console.log("💾 Saved to localStorage:", {
            authTokenSaved: !!localStorage.getItem("authToken"),
            tokenSaved: !!localStorage.getItem("token"),
            userSaved: !!localStorage.getItem("user")
          });
          
          return { 
            success: true, 
            user: userData,
            token: token
          };
        } else {
          console.error("❌ Missing data in response:", response.data);
          throw new Error("Invalid response from server");
        }
      } else {
        throw new Error(response.data?.message || "Login failed");
      }
      
    } catch (error) {
      console.error("💥 Login error:", {
        message: error.message,
        response: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      dispatch(logoutUser());
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear everything
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      
      dispatch(logoutUser());
      console.log("✅ Logout completed");
    }
  };

  // ✅ FIXED: Use useMemo for performance and stability
  const value = useMemo(() => ({
    user,
    loading,
    token,
    isAuthenticated: !!token && !!user,
    // ✅ ADDED: Proper isAdmin calculation
    isAdmin: user ? ['admin', 'super_admin', 'system_admin'].includes(user.role) : false,
    // ✅ ADDED: Other role checks
    isRecruiter: user?.role === 'recruiter',
    isFreelancer: user?.role === 'freelancer',
    isCandidate: user?.role === 'candidate',
    isCompany: user?.role === 'company',
    login,
    logout,
    // ✅ ADDED: Refresh function
    refreshUser: async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data?.user) {
          const userData = response.data.user;
          dispatch(setCredentials({ user: userData, token }));
          localStorage.setItem("user", JSON.stringify(userData));
          return { success: true, user: userData };
        }
      } catch (error) {
        console.error("Refresh user error:", error);
      }
      return { success: false };
    }
  }), [user, token, loading, dispatch]);

  // Debug log
  useEffect(() => {
    console.log("🔐 Auth Context Updated:", {
      userEmail: user?.email,
      userRole: user?.role,
      isAuthenticated: !!token && !!user,
      isAdmin: value.isAdmin,
      tokenExists: !!token
    });
  }, [user, token, value.isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ ADDED: Custom hook for admin access
export const useAdminAccess = () => {
  const { user, isAdmin } = useAuth();
  
  return {
    isAdmin,
    userEmail: user?.email,
    userRole: user?.role,
    canManageUsers: isAdmin,
    canManageJobs: isAdmin || user?.role === 'recruiter',
    canViewAnalytics: isAdmin || user?.role === 'recruiter' || user?.role === 'company'
  };
};

export default AuthContext;