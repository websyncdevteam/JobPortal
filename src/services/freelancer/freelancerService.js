import { advancedApi as api } from '../api';

class FreelancerService {
  
  // 🔹 Profile Management
  async onboard(onboardingData) {
    try {
      const response = await api.post('/freelancer/onboard', onboardingData);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to complete onboarding');
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/freelancer/profile');
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch profile');
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/freelancer/profile', profileData);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to update profile');
    }
  }

  // 🔹 Dashboard Data
  async getDashboard() {
    try {
      const response = await api.get('/freelancer/dashboard');
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to load dashboard');
    }
  }

  // 🔹 Placement Management
  async getPlacements(filters = {}) {
    try {
      const response = await api.get('/placement/freelancer/placements', { 
        params: this.sanitizeParams(filters) 
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch placements');
    }
  }

  async getPlacement(placementId) {
    try {
      const response = await api.get(`/placement/freelancer/placements/${placementId}`);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch placement details');
    }
  }

  async submitCandidate(candidateData) {
    try {
      const response = await api.post('/placement/submit-candidate', candidateData);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to submit candidate');
    }
  }

  async withdrawPlacement(placementId, reason) {
    try {
      const response = await api.patch(`/placement/freelancer/placements/${placementId}/withdraw`, { reason });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to withdraw placement');
    }
  }

  // 🔹 Job Management
  async getAvailableJobs(filters = {}) {
    try {
      const response = await api.get('/placement/freelancer/available-jobs', {
        params: this.sanitizeParams(filters)
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch available jobs');
    }
  }

  // 🔹 Earnings & Payouts
  async getEarnings(timeframe = 'all') {
    try {
      const response = await api.get('/freelancer/earnings', { 
        params: { timeframe } 
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch earnings');
    }
  }

  async getPayouts(filters = {}) {
    try {
      const response = await api.get('/payout/freelancer/my-payouts', {
        params: this.sanitizeParams(filters)
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch payouts');
    }
  }

  async requestPayout(payoutData) {
    try {
      const response = await api.post('/payout/request', payoutData);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to request payout');
    }
  }

  // 🔹 Analytics & Stats
  async getPlacementStats() {
    try {
      const response = await api.get('/placement/freelancer/placements/stats');
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch placement statistics');
    }
  }

  // 🔹 Utility Methods
  handleResponse(response) {
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Request failed');
    }
  }

  handleError(error, defaultMessage) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(defaultMessage);
    }
  }

  sanitizeParams(params) {
    const sanitized = { ...params };
    
    // Remove undefined, null, empty strings
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined || sanitized[key] === null || sanitized[key] === '') {
        delete sanitized[key];
      }
    });
    
    return sanitized;
  }

  // 🔹 File Upload with Progress
  async uploadResume(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await api.upload('/upload/resume', formData, onProgress);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to upload resume');
    }
  }
}

// Create singleton instance
const freelancerService = new FreelancerService();
export default freelancerService;