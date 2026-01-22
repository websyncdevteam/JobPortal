// src/redux/authSlice.js - ENHANCED COMPLETE VERSION
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "@/services/authService";

// Enhanced initial state with persistence
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedSession = localStorage.getItem("authSession");
    
    let parsedUser = null;
    let parsedSession = null;
    
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : null;
      parsedSession = storedSession ? JSON.parse(storedSession) : null;
    } catch (parseError) {
      console.error('Error parsing stored auth data:', parseError);
      // Clear corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authSession");
    }
    
    return {
      loading: false,
      user: parsedUser,
      token: storedToken || null,
      refreshToken: storedRefreshToken || null,
      session: parsedSession,
      isAuthenticated: !!storedToken && !!parsedUser,
      lastActivity: Date.now(),
      permissions: parsedUser?.permissions || [],
      error: null,
      sessionExpiry: storedToken ? Date.now() + (15 * 60 * 1000) : null // 15 minutes
    };
  } catch (error) {
    console.error('Error initializing auth state:', error);
    return getDefaultState();
  }
};

const getDefaultState = () => ({
  loading: false,
  user: null,
  token: null,
  refreshToken: null,
  session: null,
  isAuthenticated: false,
  lastActivity: Date.now(),
  permissions: [],
  error: null,
  sessionExpiry: null
});

// Async thunks for API operations
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (!response.success) {
        return rejectWithValue({
          message: response.message || 'Login failed',
          code: response.code
        });
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Login failed',
        code: error.response?.data?.code || 'LOGIN_ERROR'
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return true;
    } catch (error) {
      // Even if API call fails, we should logout locally
      console.error('Logout API error:', error);
      return true;
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authAPI.refreshToken();
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Token refresh failed',
        code: error.response?.data?.code || 'REFRESH_ERROR'
      });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authAPI.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch user',
        code: error.response?.data?.code || 'USER_FETCH_ERROR'
      });
    }
  }
);

// Enhanced auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.lastActivity = Date.now();
      
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
        // Update permissions based on user role
        state.permissions = getPermissionsForRole(action.payload.role);
      } else {
        localStorage.removeItem("user");
        state.permissions = [];
      }
    },
    
    setCredentials: (state, action) => {
      const { user, token, refreshToken, session } = action.payload;
      
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.session = session;
      state.isAuthenticated = true;
      state.lastActivity = Date.now();
      state.sessionExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes
      state.permissions = getPermissionsForRole(user?.role);
      state.error = null;
      
      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (session) localStorage.setItem("authSession", JSON.stringify(session));
    },
    
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
        state.permissions = getPermissionsForRole(state.user.role);
      }
    },
    
    updateActivity: (state) => {
      state.lastActivity = Date.now();
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Enhanced logout that clears everything
    clearAuth: (state) => {
      Object.assign(state, getDefaultState());
      
      // Clear all auth-related localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authSession");
    },
    
    // Token management
    updateToken: (state, action) => {
      state.token = action.payload;
      state.sessionExpiry = Date.now() + (15 * 60 * 1000);
      localStorage.setItem("authToken", action.payload);
    },
    
    // Check session expiry
    checkSessionExpiry: (state) => {
      if (state.sessionExpiry && Date.now() > state.sessionExpiry) {
        console.warn('Session expired, logging out...');
        Object.assign(state, getDefaultState());
        localStorage.clear();
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.session = { id: action.payload.sessionId };
        state.isAuthenticated = true;
        state.lastActivity = Date.now();
        state.sessionExpiry = Date.now() + (15 * 60 * 1000);
        state.permissions = getPermissionsForRole(action.payload.user?.role);
        state.error = null;
        
        // Persist
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("authSession", JSON.stringify({ id: action.payload.sessionId }));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, getDefaultState());
        localStorage.clear();
      })
      
      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.sessionExpiry = Date.now() + (15 * 60 * 1000);
        localStorage.setItem("authToken", action.payload.access_token);
        localStorage.setItem("refreshToken", action.payload.refresh_token);
      })
      .addCase(refreshToken.rejected, (state) => {
        // If refresh fails, logout user
        Object.assign(state, getDefaultState());
        localStorage.clear();
      })
      
      // Get current user cases
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.lastActivity = Date.now();
        state.permissions = getPermissionsForRole(action.payload?.role);
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
        // Don't logout on user fetch error, just show error
      });
  }
});

// Permission utility function
function getPermissionsForRole(role) {
  const permissions = {
    admin: ['*'],
    super_admin: ['*'],
    recruiter: [
      'post_jobs', 
      'view_candidates', 
      'manage_interviews',
      'view_analytics',
      'manage_applications'
    ],
    company: [
      'view_analytics', 
      'manage_recruiters',
      'view_candidates',
      'view_jobs'
    ],
    freelancer: [
      'submit_candidates', 
      'view_placements',
      'view_earnings',
      'update_profile'
    ],
    candidate: [
      'apply_jobs', 
      'view_profile',
      'save_jobs',
      'track_applications'
    ],
    user: ['view_jobs', 'update_profile']
  };
  
  return permissions[role] || permissions.user;
}

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsRecruiter = (state) => state.auth.user?.role === 'recruiter';
export const selectIsFreelancer = (state) => state.auth.user?.role === 'freelancer';
export const selectPermissions = (state) => state.auth.permissions;
export const selectHasPermission = (state, permission) => 
  state.auth.permissions.includes('*') || state.auth.permissions.includes(permission);

// Export actions and reducer
export const { 
  setLoading, 
  setUser, 
  setCredentials, 
  updateUser, 
  updateActivity,
  clearError,
  setError,
  clearAuth,
  updateToken,
  checkSessionExpiry
} = authSlice.actions;

export default authSlice.reducer;