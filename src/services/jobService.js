import api from './api.js';
import { toast } from 'sonner';

export const jobService = {
  // Save or unsave a job
  saveJob: async (jobId) => {
    try {
      console.log(`💾 Attempting to save/unsave job ${jobId}`);
      const response = await api.post(`/jobs/${jobId}/save`);

      if (response.data.success) {
        const message = response.data.saved
          ? '✅ Job saved successfully!'
          : '🗑️ Job removed from saved jobs';
        toast.success(message);
        return response.data;
      }

      return response.data;
    } catch (error) {
      console.error('❌ Save job error:', error);
      if (error.response?.status === 401) {
        toast.error('🔐 Please login to save jobs');
        throw new Error('Authentication required');
      }
      toast.error(error.response?.data?.message || '❌ Failed to save job');
      throw error;
    }
  },

  // Get saved jobs for current user
  getSavedJobs: async () => {
    try {
      console.log('📥 Fetching saved jobs');
      const response = await api.get('/jobs/user/saved');

      if (response.data.success) {
        console.log(`✅ Found ${response.data.count} saved jobs`);
        return response.data;
      }

      throw new Error('Failed to fetch saved jobs');
    } catch (error) {
      console.error('❌ Get saved jobs error:', error);
      toast.error('Failed to load saved jobs');
      throw error;
    }
  },

  // Check if a specific job is saved
  checkIfJobIsSaved: async (jobId) => {
    try {
      const response = await api.get('/jobs/user/saved');

      if (response.data.success && response.data.data) {
        const savedJobs = response.data.data;
        return savedJobs.some(job =>
          job._id === jobId || job._id?._id === jobId
        );
      }
      return false;
    } catch (error) {
      console.error('❌ Check saved status error:', error);
      return false;
    }
  },

  // Get job by ID
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get job by ID error:', error);
      throw error;
    }
  },

  // Get all jobs with filters
  getAllJobs: async (filters = {}) => {
    try {
      // Ensure filters are converted to query params properly
      const params = new URLSearchParams(filters).toString();
      const url = `/jobs${params ? `?${params}` : ''}`;
      console.log(`📡 Fetching all jobs from: ${url}`);

      const response = await api.get(url);
      if (response.data.success) {
        console.log(`✅ Fetched ${response.data.count} jobs`);
        return response.data;
      }

      throw new Error('Failed to fetch jobs');
    } catch (error) {
      console.error('❌ Get all jobs error:', error);
      toast.error('Failed to load jobs');
      throw error;
    }
  },

  // ✅ NEW: Apply to a job
  applyToJob: async (jobId) => {
    try {
      console.log(`📝 Applying to job ${jobId}`);
      const response = await api.post(`/application/${jobId}/apply`);
      
      if (response.data.success) {
        toast.success('✅ Application submitted successfully!');
        return response.data;
      } else {
        // Handle backend success: false responses
        toast.error(response.data.message || 'Failed to apply for job');
        throw new Error(response.data.message || 'Application failed');
      }
    } catch (error) {
      console.error('❌ Apply to job error:', error);
      
      // Check for specific error responses
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('🔐 Please login to apply for jobs');
      } else if (error.response?.status === 409) {
        toast.error('⚠️ You have already applied for this job');
      } else if (error.response?.status === 404) {
        toast.error('❌ Job not found');
      } else if (error.response?.status === 400) {
        toast.error('❌ Job is no longer accepting applications');
      } else {
        toast.error('❌ Failed to apply for job. Please try again later');
      }
      
      throw error;
    }
  },

  // ✅ NEW: Check if user has already applied to a job
  checkIfApplied: async (jobId) => {
    try {
      const response = await api.get('/application/my');
      
      if (response.data.success && response.data.applications) {
        const appliedJobs = response.data.applications;
        return appliedJobs.some(app => 
          app.job?._id === jobId || app.job === jobId
        );
      }
      return false;
    } catch (error) {
      console.error('❌ Check applied status error:', error);
      return false;
    }
  },
};