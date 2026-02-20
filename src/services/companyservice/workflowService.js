import api from "../../services/api";
import { toast } from "sonner";

// API Base URL from environment or fallback to production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com/api/v1';

class WorkflowService {
  constructor() {
    this.cache = {
      dashboard: null,
      candidates: null,
      analytics: null,
      notifications: null,
      slots: null,
    };
    this.cacheTimestamp = {};
    
    // Store the last token for debugging
    this.lastToken = null;
  }

  // ========== CRITICAL FIX: ENSURE TOKEN IS AVAILABLE ==========
  
  // Helper method to check and ensure token is available
  ensureToken() {
    // Check BOTH possible token locations
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No authentication token found!');
      console.log('🔍 Checking localStorage:', {
        authToken: localStorage.getItem('authToken'),
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
      });
      
      // Clear any invalid API headers
      delete api.defaults.headers.common['Authorization'];
      
      throw new Error('Authentication token not found. Please login again.');
    }
    
    // Update API headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    if (this.lastToken !== token) {
      console.log(`🔐 Token updated: ${token.substring(0, 20)}...`);
      this.lastToken = token;
    }
    
    return token;
  }

  // Cache management
  getCached(key, maxAge = 60000) {
    const cached = this.cache[key];
    const timestamp = this.cacheTimestamp[key];
    
    if (cached && timestamp && Date.now() - timestamp < maxAge) {
      console.log(`📦 Using cached ${key}`);
      return cached;
    }
    return null;
  }

  setCache(key, data) {
    this.cache[key] = data;
    this.cacheTimestamp[key] = Date.now();
  }

  clearCache(key = null) {
    if (key) {
      delete this.cache[key];
      delete this.cacheTimestamp[key];
    } else {
      this.cache = { dashboard: null, candidates: null, analytics: null, notifications: null, slots: null };
      this.cacheTimestamp = {};
    }
  }

  // ========== REAL API METHODS ==========

  // ✅ DASHBOARD - REAL API
  async getDashboard(forceRefresh = false) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      if (!forceRefresh) {
        const cached = this.getCached("dashboard", 30000);
        if (cached) return cached;
      }

      console.log("📊 Fetching company dashboard...");
      const response = await api.get("/company/workflow/dashboard");
      
      if (response.data.success) {
        const dashboardData = {
          ...response.data.data,
          lastUpdated: new Date(),
          source: "api",
        };
        this.setCache("dashboard", dashboardData);
        return dashboardData;
      }
      
      throw new Error(response.data.message || "Failed to load dashboard");
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard data");
      throw error;
    }
  }

  // ✅ CANDIDATES - REAL API
  async getCandidates(params = {}, forceRefresh = false) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const cacheKey = `candidates_${JSON.stringify(params)}`;
      
      if (!forceRefresh) {
        const cached = this.getCached(cacheKey, 60000);
        if (cached) return cached;
      }

      console.log("👥 Fetching company candidates...");
      const response = await api.get("/company/workflow/candidates", { params });
      
      if (response.data.success) {
        const candidatesData = {
          candidates: response.data.data?.candidates || [],
          pagination: response.data.data?.pagination || {},
          source: "api",
        };
        this.setCache(cacheKey, candidatesData);
        return candidatesData;
      }
      
      throw new Error(response.data.message || "Failed to load candidates");
    } catch (error) {
      console.error("Candidates fetch error:", error);
      toast.error("Failed to load candidates");
      throw error;
    }
  }

  // ✅ UPDATE CANDIDATE STATUS - REAL API
  async updateCandidateStatus(applicationId, statusData) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      console.log(`🔄 Updating candidate ${applicationId} status to ${statusData.status}`);
      const response = await api.patch(
        `/company/workflow/candidates/${applicationId}/status`,
        statusData
      );
      
      if (response.data.success) {
        // Clear relevant cache
        this.clearCache("candidates");
        this.clearCache("dashboard");
        
        toast.success("Candidate status updated successfully");
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Failed to update status");
    } catch (error) {
      console.error("Update status error:", error);
      const errorMessage = error.response?.data?.message || "Failed to update candidate status";
      toast.error(errorMessage);
      throw error;
    }
  }

  // ✅ NOTIFICATIONS - REAL API
  async getNotifications(forceRefresh = false) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      if (!forceRefresh) {
        const cached = this.getCached("notifications", 30000);
        if (cached) return cached;
      }

      console.log("🔔 Fetching company notifications...");
      const response = await api.get("/company/workflow/notifications");
      
      if (response.data.success) {
        const notificationsData = {
          notifications: response.data.data?.notifications || response.data.data || [],
          unreadCount: response.data.data?.unreadCount || 0,
          total: response.data.data?.total || 0,
          source: "api",
        };
        this.setCache("notifications", notificationsData);
        return notificationsData;
      }
      
      throw new Error(response.data.message || "Failed to load notifications");
    } catch (error) {
      console.error("Notifications fetch error:", error);
      
      // For notifications, we return empty array instead of throwing
      // because notifications are not critical functionality
      return { 
        notifications: [], 
        unreadCount: 0, 
        total: 0,
        source: "error",
        error: error.message 
      };
    }
  }

  // ✅ MARK NOTIFICATION AS READ - REAL API
  async markNotificationAsRead(notificationId) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.patch(
        `/company/workflow/notifications/${notificationId}/read`
      );
      
      if (response.data.success) {
        this.clearCache("notifications");
        return response.data;
      }
      
      throw new Error(response.data.message || "Failed to mark as read");
    } catch (error) {
      console.error("Mark as read error:", error);
      throw error;
    }
  }

  // ✅ MARK ALL NOTIFICATIONS AS READ - REAL API
  async markAllNotificationsAsRead() {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.post("/company/workflow/notifications/mark-all-read");
      
      if (response.data.success) {
        this.clearCache("notifications");
        return response.data;
      }
      
      throw new Error(response.data.message || "Failed to mark all as read");
    } catch (error) {
      console.error("Mark all as read error:", error);
      throw error;
    }
  }

  // ✅ DELETE NOTIFICATION - REAL API
  async deleteNotification(notificationId) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.delete(
        `/company/workflow/notifications/${notificationId}`
      );
      
      if (response.data.success) {
        this.clearCache("notifications");
        return response.data;
      }
      
      throw new Error(response.data.message || "Failed to delete notification");
    } catch (error) {
      console.error("Delete notification error:", error);
      throw error;
    }
  }

  // ✅ ANALYTICS - REAL API (FIXED ENDPOINT)
  async getAnalytics(params = {}, forceRefresh = false) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const cacheKey = `analytics_${JSON.stringify(params)}`;
      
      if (!forceRefresh) {
        const cached = this.getCached(cacheKey, 120000);
        if (cached) return cached;
      }

      console.log("📈 Fetching company analytics...");
      console.log(`🔐 Token status: ${this.lastToken ? 'Available' : 'Missing'}`);
      console.log(`🔗 API URL: /company/workflow/analytics?period=${params.period || '30d'}`);
      
      // Add debug headers
      const debugHeaders = {
        'X-Debug-Token': this.lastToken ? 'yes' : 'no',
        'X-Request-Time': new Date().toISOString()
      };
      
      // ⭐ CRITICAL FIX: Use correct endpoint WITHOUT /api/v1 prefix
      const response = await api.get("/company/workflow/analytics", { 
        params,
        headers: { ...debugHeaders }
      });
      
      if (response.data.success) {
        const analyticsData = {
          ...response.data.analytics,
          source: "api",
          fetchedAt: new Date(),
        };
        this.setCache(cacheKey, analyticsData);
        return analyticsData;
      }
      
      throw new Error(response.data.message || "Failed to load analytics");
    } catch (error) {
      console.error("Analytics fetch error:", error);
      console.log("🔍 Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        hasToken: !!this.lastToken,
        url: error.config?.url
      });
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        
        // Clear tokens and redirect
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect after delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        
        throw new Error('Authentication failed. Please login again.');
      }
      
      // Check if it's a 404
      if (error.response?.status === 404) {
        toast.error("Analytics endpoint not found. Please contact support.");
        throw new Error('Analytics endpoint not found. The server may be misconfigured.');
      }
      
      toast.error("Failed to load analytics data");
      throw error;
    }
  }

  // ✅ INTERVIEW SLOTS - REAL API
  async getInterviewSlots(params = {}) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.get("/company/workflow/slots", { params });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Failed to load interview slots");
    } catch (error) {
      console.error("Interview slots fetch error:", error);
      throw error;
    }
  }

  // ✅ CREATE INTERVIEW SLOT - REAL API
  async createInterviewSlot(slotData) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.post("/company/workflow/slots", {
        action: "create",
        ...slotData,
      });
      
      if (response.data.success) {
        toast.success("Interview slot created successfully");
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Failed to create interview slot");
    } catch (error) {
      console.error("Create slot error:", error);
      toast.error("Failed to create interview slot");
      throw error;
    }
  }

  // ✅ UPDATE INTERVIEW SLOT - REAL API
  async updateInterviewSlot(slotId, updateData) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.post("/company/workflow/slots", {
        action: "update",
        slotId,
        ...updateData,
      });
      
      if (response.data.success) {
        toast.success("Interview slot updated successfully");
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Failed to update interview slot");
    } catch (error) {
      console.error("Update slot error:", error);
      toast.error("Failed to update interview slot");
      throw error;
    }
  }

  // ✅ DELETE INTERVIEW SLOT - REAL API
  async deleteInterviewSlot(slotId) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.post("/company/workflow/slots", {
        action: "delete",
        slotId,
      });
      
      if (response.data.success) {
        toast.success("Interview slot deleted successfully");
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Failed to delete interview slot");
    } catch (error) {
      console.error("Delete slot error:", error);
      toast.error("Failed to delete interview slot");
      throw error;
    }
  }

  // ✅ JOB APPLICANT COUNTS - REAL API
  async getJobApplicantCounts(jobId) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.get(
        `/company/workflow/jobs/${jobId}/applicant-counts`
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Failed to load applicant counts");
    } catch (error) {
      console.error("Job applicant counts error:", error);
      throw error;
    }
  }

  // ✅ COMPANY PROFILE - REAL API
  async getCompanyProfile() {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.get("/company/profile");
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Failed to load company profile");
    } catch (error) {
      console.error("Company profile error:", error);
      throw error;
    }
  }

  // ✅ UPDATE COMPANY PROFILE - REAL API
  async updateCompanyProfile(profileData) {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const response = await api.put("/company/profile", profileData);
      
      if (response.data.success) {
        toast.success("Company profile updated successfully");
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Failed to update company profile");
    } catch (error) {
      console.error("Update company profile error:", error);
      toast.error("Failed to update company profile");
      throw error;
    }
  }

  // ✅ VALIDATE ENDPOINTS - REAL API
  async validateEndpoints() {
    try {
      // CRITICAL: Ensure token before API call
      this.ensureToken();
      
      const endpoints = [
        { name: "Dashboard", path: "/company/workflow/dashboard" },
        { name: "Candidates", path: "/company/workflow/candidates" },
        { name: "Notifications", path: "/company/workflow/notifications" },
        { name: "Analytics", path: "/company/workflow/analytics" },
      ];

      const results = [];

      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint.path);
          results.push({
            name: endpoint.name,
            status: response.status,
            success: response.data.success || false,
            message: response.data.message || "OK",
          });
        } catch (error) {
          results.push({
            name: endpoint.name,
            status: error.response?.status || 0,
            success: false,
            message: error.response?.data?.message || error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error("Validate endpoints error:", error);
      return [{
        name: "All Endpoints",
        status: 0,
        success: false,
        message: "Cannot validate endpoints: " + error.message
      }];
    }
  }
  
  // ✅ NEW: DEBUG METHOD TO CHECK AUTH STATUS
  async debugAuthStatus() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔍 Auth Debug:', {
      tokenExists: !!token,
      tokenLength: token ? token.length : 0,
      userExists: !!user,
      userParsed: user ? JSON.parse(user) : null,
      apiHeaders: api.defaults.headers.common['Authorization'] ? 'Set' : 'Not set'
    });
    
    return {
      tokenExists: !!token,
      userExists: !!user,
      apiHeadersSet: !!api.defaults.headers.common['Authorization']
    };
  }
  
  // ✅ NEW: TEST ANALYTICS ENDPOINT DIRECTLY
  async testAnalyticsEndpoint() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    try {
      console.log("🧪 Testing analytics endpoint directly...");
      
      // Test with fetch directly to avoid axios issues – use environment variable
      const response = await fetch(`${API_BASE_URL}/company/workflow/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      };
      
      if (response.ok) {
        const data = await response.json();
        result.data = data;
      } else {
        const errorText = await response.text();
        result.error = errorText;
      }
      
      console.log("🧪 Direct test result:", result);
      return result;
      
    } catch (error) {
      console.error("🧪 Direct test failed:", error);
      return { error: error.message };
    }
  }
}

// Export as singleton instance
const workflowService = new WorkflowService();
export { workflowService as WorkflowService };
export default workflowService;
