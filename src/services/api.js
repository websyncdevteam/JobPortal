// src/services/api.js - FIXED VERSION
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with advanced configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ FIXED: Enhanced request interceptor with proper token handling
api.interceptors.request.use(
  (config) => {
    // ✅ FIX: Try BOTH token keys for compatibility
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Token added to request: ${token.substring(0, 20)}...`);
    } else {
      console.warn('⚠️ No token found for API request');
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    console.log(`🚀 API ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ FIXED: Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    
    // ✅ FIX: If response contains new token, update it
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('token', response.data.token); // For compatibility
      console.log('🔄 Token updated from response');
    }
    
    return response;
  },
  async (error) => {
    const { config, response } = error;
    
    console.error(`❌ API Error:`, {
      url: config?.url,
      method: config?.method,
      status: response?.status,
      data: response?.data
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (response?.status === 401) {
      console.log('🔐 401 Unauthorized - Clearing tokens');
      
      // Clear both tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      
      // Show user-friendly message
      toast.error('Your session has expired. Please login again.');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    }
    
    // Handle 403 Forbidden (ADMIN ACCESS ISSUE)
    if (response?.status === 403) {
      const message = response.data?.message || 'Access denied';
      const userRole = response.data?.userRole || 'unknown';
      
      console.warn(`🚫 403 Forbidden: ${message}`, {
        userRole: userRole,
        path: config?.url
      });
      
      toast.error(`Access Denied: ${message}`);
      
      // If it's an admin route and user is not admin, redirect to dashboard
      if (config?.url.includes('/admin/') && userRole !== 'admin') {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    }
    
    // Handle 404 Not Found
    if (response?.status === 404) {
      console.warn('🔍 404 Not Found:', config?.url);
      toast.error('Resource not found');
    }
    
    // Handle 500 Server Error
    if (response?.status >= 500) {
      console.error('💥 Server Error:', config?.url);
      toast.error('Server error. Please try again later.');
    }
    
    // Handle network errors
    if (!response) {
      console.error('🌐 Network Error');
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// Generate unique request ID
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ✅ FIXED: Enhanced API methods with token validation
export const advancedApi = {
  get: async (url, config = {}) => {
    // Validate token before request
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token && !url.includes('/auth/')) {
      console.warn('⚠️ No token found for protected API call');
    }
    return api.get(url, config);
  },
  
  post: async (url, data, config = {}) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token && !url.includes('/auth/')) {
      console.warn('⚠️ No token found for protected API call');
    }
    return api.post(url, data, config);
  },
  
  put: async (url, data, config = {}) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token && !url.includes('/auth/')) {
      console.warn('⚠️ No token found for protected API call');
    }
    return api.put(url, data, config);
  },
  
  patch: async (url, data, config = {}) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token && !url.includes('/auth/')) {
      console.warn('⚠️ No token found for protected API call');
    }
    return api.patch(url, data, config);
  },
  
  delete: async (url, config = {}) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token && !url.includes('/auth/')) {
      console.warn('⚠️ No token found for protected API call');
    }
    return api.delete(url, config);
  },
  
  // Upload with progress tracking
  upload: (url, formData, onProgress = null) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No token found for upload');
    }
    
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : undefined
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
  },
  
  // ✅ NEW: Check token validity
  validateToken: async () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const response = await api.get('/auth/verify');
      return response.data.success || false;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
};

export default api;