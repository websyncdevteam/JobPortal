// src/services/authService.js - UPDATED WITH VERIFICATION HANDLING
import api from "./api";

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      // ✅ CHECK FOR VERIFICATION ERROR
      if (response.data.code === 'EMAIL_NOT_VERIFIED') {
        // Handle unverified email - don't save tokens
        throw {
          isVerificationError: true,
          code: response.data.code,
          message: response.data.message,
          email: response.data.email,
          requiresVerification: true
        };
      }
      
      // ✅ Save tokens only if login successful
      if (response.data.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('token', response.data.token);
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        console.log('✅ Login successful - Tokens saved');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // ✅ Pass through verification errors
      if (error.isVerificationError) {
        throw error;
      }
      
      // Handle other errors
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.log('✅ Logout successful - Tokens cleared');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data.user || response.data.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData); // Changed from /auth/signup
      
      // ✅ After signup, don't save tokens - user needs verification
      if (response.data.success && response.data.message?.includes('check your email')) {
        // Return special flag for verification required
        return {
          ...response.data,
          requiresVerification: true,
          email: userData.email
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh");
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await api.get("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Verify token error:', error);
      throw error;
    }
  },

  hasToken: () => {
    return !!localStorage.getItem('authToken') || !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  },

  // ✅ VERIFICATION METHODS
  sendVerification: async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      console.error('Send verification error:', error);
      throw error;
    }
  },

  verifyEmail: async (token, email) => {
    try {
      const response = await api.post('/auth/verify-email', { token, email });
      return response.data;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (token, email, password) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // ✅ NEW: Check if user is verified via API
  checkVerificationStatus: async () => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user || response.data.data;
      return {
        isVerified: user?.isVerified || false,
        user: user
      };
    } catch (error) {
      console.error('Check verification error:', error);
      return { isVerified: false, user: null };
    }
  },

  // ✅ NEW: Handle API errors with verification check
  handleApiError: (error) => {
    // Check for verification error from backend
    if (error.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
      return {
        isVerificationError: true,
        message: error.response.data.message,
        email: error.response.data.email,
        code: error.response.data.code
      };
    }
    
    // Check for verification middleware error
    if (error.response?.data?.requiresVerification) {
      return {
        isVerificationError: true,
        message: error.response.data.message,
        email: error.response.data.email,
        code: 'EMAIL_NOT_VERIFIED'
      };
    }
    
    return null; // No verification error
  }
};