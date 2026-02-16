import api from "../api";


class PlacementService {
  
  // Get placements with advanced filtering
  async getPlacements(filters = {}) {
    try {
      const response = await api.get('/placement/freelancer/placements', { 
        params: this.buildQueryParams(filters) 
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch placements');
    }
  }

  // Get specific placement details
  async getPlacementDetails(placementId) {
    try {
      const response = await api.get(`/placement/freelancer/placements/${placementId}`);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch placement details');
    }
  }

  // Submit new candidate
  async submitCandidate(candidateData) {
    try {
      const response = await api.post('/placement/submit-candidate', candidateData);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to submit candidate');
    }
  }

  // Withdraw placement
  async withdrawPlacement(placementId, reason) {
    try {
      const response = await api.patch(`/placement/freelancer/placements/${placementId}/withdraw`, { reason });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to withdraw placement');
    }
  }

  // Get available jobs for submission
  async getAvailableJobs(filters = {}) {
    try {
      const response = await api.get('/placement/freelancer/available-jobs', {
        params: this.buildQueryParams(filters)
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch available jobs');
    }
  }

  // Get placement statistics
  async getPlacementStats() {
    try {
      const response = await api.get('/placement/freelancer/placements/stats');
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch placement statistics');
    }
  }

  // Utility methods
  buildQueryParams(filters) {
    const params = { ...filters };
    
    // Convert arrays to strings
    Object.keys(params).forEach(key => {
      if (Array.isArray(params[key])) {
        params[key] = params[key].join(',');
      }
    });
    
    return params;
  }

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
    } else {
      throw new Error(defaultMessage);
    }
  }
}

const placementService = new PlacementService();
export default placementService;
