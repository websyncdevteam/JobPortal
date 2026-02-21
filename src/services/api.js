// src/services/api.js
import axios from 'axios';
import { toast } from 'sonner';

// 🔹 Base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com/api/v1',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================
// 🔐 REQUEST INTERCEPTOR
// ==============================
api.interceptors.request.use(
  (config) => {
    // Try both possible token keys
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// 🚨 RESPONSE INTERCEPTOR
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Clear both possible token keys
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      setTimeout(() => (window.location.href = '/login'), 1200);
    }

    if (status === 403) toast.error('Access denied');
    if (status >= 500) toast.error('Server error. Try again later.');

    return Promise.reject(error);
  }
);

export default api;
