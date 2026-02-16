// src/services/freelancer/freelancerService.js
import api from '../api';

class FreelancerService {
  // 🔹 Profile Management
  async onboard(data) {
    return this._post('/freelancer/onboard', data, 'Failed to complete onboarding');
  }

  async getProfile() {
    return this._get('/freelancer/profile', 'Failed to fetch profile');
  }

  async updateProfile(data) {
    return this._put('/freelancer/profile', data, 'Failed to update profile');
  }

  // 🔹 Dashboard
  async getDashboard() {
    return this._get('/freelancer/dashboard', 'Failed to load dashboard');
  }

  // 🔹 Placement Management
  async getPlacements(filters = {}) {
    return this._get('/placement/freelancer/placements', 'Failed to fetch placements', filters);
  }

  async getPlacement(id) {
    return this._get(`/placement/freelancer/placements/${id}`, 'Failed to fetch placement details');
  }

  async submitCandidate(data) {
    return this._post('/placement/submit-candidate', data, 'Failed to submit candidate');
  }

  async withdrawPlacement(id, reason) {
    return this._patch(`/placement/freelancer/placements/${id}/withdraw`, { reason }, 'Failed to withdraw placement');
  }

  // 🔹 Job Management
  async getAvailableJobs(filters = {}) {
    return this._get('/placement/freelancer/available-jobs', 'Failed to fetch available jobs', filters);
  }

  // 🔹 Earnings & Payouts
  async getEarnings(timeframe = 'all') {
    return this._get('/freelancer/earnings', 'Failed to fetch earnings', { timeframe });
  }

  async getPayouts(filters = {}) {
    return this._get('/payout/freelancer/my-payouts', 'Failed to fetch payouts', filters);
  }

  async requestPayout(data) {
    return this._post('/payout/request', data, 'Failed to request payout');
  }

  // 🔹 Analytics
  async getPlacementStats() {
    return this._get('/placement/freelancer/placements/stats', 'Failed to fetch placement statistics');
  }

  // 🔹 File Upload
  async uploadResume(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress) onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error, 'Failed to upload resume');
    }
  }

  // ==============================
  // 🔹 PRIVATE HELPERS
  // ==============================
  _get(url, errorMsg, params = {}) {
    return this._request('get', url, null, errorMsg, params);
  }

  _post(url, data, errorMsg) {
    return this._request('post', url, data, errorMsg);
  }

  _put(url, data, errorMsg) {
    return this._request('put', url, data, errorMsg);
  }

  _patch(url, data, errorMsg) {
    return this._request('patch', url, data, errorMsg);
  }

  async _request(method, url, data, errorMsg, params = {}) {
    try {
      const response = await api({ method, url, data, params: this._sanitizeParams(params) });
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error, errorMsg);
    }
  }

  _handleResponse(response) {
    if (response.data.success) return response.data;
    throw new Error(response.data.message || 'Request failed');
  }

  _handleError(error, defaultMsg) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    else if (error.message) throw new Error(error.message);
    else throw new Error(defaultMsg);
  }

  _sanitizeParams(params) {
    const sanitized = { ...params };
    Object.keys(sanitized).forEach(
      (key) => (sanitized[key] === undefined || sanitized[key] === null || sanitized[key] === '') && delete sanitized[key]
    );
    return sanitized;
  }
}

// 🔹 Singleton
const freelancerService = new FreelancerService();
export default freelancerService;
