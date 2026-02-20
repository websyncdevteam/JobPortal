// src/services/admin/companyApi.js
import api from "../api"; // baseURL is configured via VITE_API_URL in api.js

export const companyAPI = {
  getAdminCompanies: async () => {
    const res = await api.get("/admin/companies");
    return res.data;
  },

  getCompany: async (id) => {
    const res = await api.get(`/admin/companies/${id}`);
    return res.data;
  },

  getCompanyActivity: async (id) => {
    const res = await api.get(`/admin/companies/${id}/activity`);
    return res.data;
  },

  getCompanyAnalytics: async (id) => {
    const res = await api.get(`/admin/companies/${id}/analytics`);
    return res.data;
  },

  createCompany: async (data) => {
    const res = await api.post("/admin/companies", data);
    return res.data;
  },

  updateCompany: async (id, data) => {
    const res = await api.put(`/admin/companies/${id}`, data);
    return res.data;
  },

  suspendCompany: async (id) => {
    const res = await api.patch(`/admin/companies/${id}/suspend`);
    return res.data;
  },

  deleteCompany: async (id) => {
    const res = await api.delete(`/admin/companies/${id}`);
    return res.data;
  },

  activateCompany: async (id) => {
    const res = await api.patch(`/admin/companies/${id}/activate`);
    return res.data;
  },
};
