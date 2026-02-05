// src/services/api.js — FINAL STABLE VERSION
import axios from 'axios';
import { toast } from 'sonner';

// 🔹 Base URL (already includes /api/v1 in env)
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
    const token = localStorage.getItem('token'); // ✅ SINGLE SOURCE OF TRUTH

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

    // 🔴 Hard 401 → logout (NO refresh guessing)
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      toast.error('Session expired. Please login again.');

      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
    }

    // 🔴 Other errors
    if (status === 403) {
      toast.error('Access denied');
    }

    if (status >= 500) {
      toast.error('Server error. Try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
