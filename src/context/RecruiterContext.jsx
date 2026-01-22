// frontend/src/context/RecruiterContext.jsx - FINAL ADVANCED VERSION

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";

const RecruiterContext = createContext();

export const useRecruiter = () => {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error("useRecruiter must be used within a RecruiterProvider");
  }
  return context;
};

export const RecruiterProvider = ({ children }) => {
  // State Management
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [recruiterCompanies, setRecruiterCompanies] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState({
    jobs: false,
    companies: false,
    candidates: false,
    interviews: false,
    analytics: false,
    general: false
  });
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  // 🔥 LOADING STATE MANAGEMENT
  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  // 🔥 ERROR HANDLING
  const handleError = (error, defaultMessage) => {
    const errorMessage = error?.response?.data?.message || 
                        error?.response?.data?.error || 
                        error?.message || 
                        defaultMessage;
    setError(errorMessage);
    console.error(`❌ ${defaultMessage}:`, error);
    return errorMessage;
  };

  // 🔥 SUCCESS HANDLING
  const handleSuccess = (message, data = null) => {
    setError(null);
    console.log(`✅ ${message}`, data);
    return { success: true, data };
  };

  // ==================== COMPANIES ====================
  const fetchRecruiterCompanies = useCallback(async () => {
    try {
      setLoadingState('companies', true);
      console.log("🔄 Fetching recruiter companies...");
      
      const response = await api.get("/recruiter/jobs/companies");
      
      if (response.data?.success && Array.isArray(response.data.data)) {
        setRecruiterCompanies(response.data.data);
        return handleSuccess(`Loaded ${response.data.data.length} companies`, response.data.data);
      } else {
        setRecruiterCompanies([]);
        return handleSuccess("No companies found", []);
      }
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch companies");
      setRecruiterCompanies([]);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('companies', false);
    }
  }, []);

  // ==================== JOBS ====================
  const fetchRecruiterJobs = useCallback(async () => {
    try {
      setLoadingState('jobs', true);
      console.log("🔄 Fetching recruiter jobs...");
      
      const response = await api.get("/recruiter/jobs");
      
      let jobsData = [];
      if (response.data?.data) jobsData = response.data.data;
      else if (Array.isArray(response.data)) jobsData = response.data;
      else if (response.data?.jobs) jobsData = response.data.jobs;
      
      setJobs(jobsData);
      
      // Calculate stats
      const activeJobs = jobsData.filter(job => job.status === 'active').length;
      setStats({
        totalJobs: jobsData.length,
        activeJobs,
        totalApplications: jobsData.reduce((sum, job) => sum + (job.applicationCount || 0), 0),
        pendingApplications: 0 // You can update this when you have application data
      });
      
      return handleSuccess(`Loaded ${jobsData.length} jobs`, jobsData);
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch jobs");
      setJobs([]);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('jobs', false);
    }
  }, []);

  const createJob = useCallback(async (jobData) => {
    try {
      setLoadingState('general', true);
      console.log("🔄 Creating job:", jobData);
      
      const response = await api.post("/recruiter/jobs", jobData);
      
      if (response.data?.success) {
        const newJob = response.data.data;
        setJobs(prev => [...prev, newJob]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalJobs: prev.totalJobs + 1,
          activeJobs: prev.activeJobs + 1
        }));
        
        return handleSuccess("Job created successfully", newJob);
      } else {
        const errorMsg = response.data?.message || "Failed to create job";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = handleError(err, "Failed to create job");
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('general', false);
    }
  }, []);

  const updateJob = useCallback(async (jobId, updateData) => {
    try {
      setLoadingState('general', true);
      console.log("🔄 Updating job:", jobId, updateData);
      
      const response = await api.put(`/recruiter/jobs/${jobId}`, updateData);
      
      if (response.data?.success) {
        const updatedJob = response.data.data;
        setJobs(prev => prev.map(job => job._id === jobId ? updatedJob : job));
        return handleSuccess("Job updated successfully", updatedJob);
      } else {
        const errorMsg = response.data?.message || "Failed to update job";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = handleError(err, "Failed to update job");
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('general', false);
    }
  }, []);

  const deleteJob = useCallback(async (jobId) => {
    try {
      setLoadingState('general', true);
      console.log("🔄 Deleting job:", jobId);
      
      const response = await api.delete(`/recruiter/jobs/${jobId}`);
      
      if (response.data?.success) {
        setJobs(prev => prev.filter(job => job._id !== jobId));
        
        // Update stats
        const deletedJob = jobs.find(job => job._id === jobId);
        if (deletedJob) {
          setStats(prev => ({
            ...prev,
            totalJobs: prev.totalJobs - 1,
            activeJobs: deletedJob.status === 'active' ? prev.activeJobs - 1 : prev.activeJobs
          }));
        }
        
        return handleSuccess("Job deleted successfully");
      } else {
        const errorMsg = response.data?.message || "Failed to delete job";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = handleError(err, "Failed to delete job");
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('general', false);
    }
  }, [jobs]);

  const updateJobStatus = useCallback(async (jobId, status) => {
    try {
      setLoadingState('general', true);
      console.log("🔄 Updating job status:", jobId, status);
      
      const response = await api.put(`/recruiter/jobs/${jobId}/status`, { status });
      
      if (response.data?.success) {
        const updatedJob = response.data.data;
        setJobs(prev => prev.map(job => job._id === jobId ? { ...job, status } : job));
        
        // Update stats
        const oldJob = jobs.find(job => job._id === jobId);
        if (oldJob) {
          setStats(prev => ({
            ...prev,
            activeJobs: status === 'active' ? prev.activeJobs + 1 : prev.activeJobs - 1
          }));
        }
        
        return handleSuccess("Job status updated successfully", updatedJob);
      } else {
        const errorMsg = response.data?.message || "Failed to update job status";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = handleError(err, "Failed to update job status");
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('general', false);
    }
  }, [jobs]);

  // ==================== CANDIDATES ====================
  const fetchCandidates = useCallback(async (jobId) => {
    try {
      setLoadingState('candidates', true);
      setSelectedJob(jobId);
      console.log("🔄 Fetching candidates for job:", jobId);
      
      const response = await api.get(`/recruiter/candidates/jobs/${jobId}/candidates`);
      
      let candidatesData = [];
      if (response.data?.data) candidatesData = response.data.data;
      else if (Array.isArray(response.data)) candidatesData = response.data;
      else if (response.data?.candidates) candidatesData = response.data.candidates;
      
      setCandidates(candidatesData);
      return handleSuccess(`Loaded ${candidatesData.length} candidates`, candidatesData);
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch candidates");
      setCandidates([]);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('candidates', false);
    }
  }, []);

  const updateCandidateStatus = useCallback(async (applicationId, status, notes = '') => {
    try {
      setLoadingState('general', true);
      console.log("🔄 Updating candidate status:", applicationId, status);
      
      const response = await api.put(`/recruiter/candidates/${applicationId}/status`, { 
        status, 
        notes 
      });
      
      if (response.data?.success) {
        const updatedCandidate = response.data.data;
        setCandidates(prev => prev.map(candidate => 
          candidate._id === applicationId ? updatedCandidate : candidate
        ));
        return handleSuccess("Candidate status updated successfully", updatedCandidate);
      } else {
        const errorMsg = response.data?.message || "Failed to update candidate status";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = handleError(err, "Failed to update candidate status");
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('general', false);
    }
  }, []);

  // ==================== INTERVIEWS ====================
  const scheduleInterview = useCallback(async (interviewData) => {
    try {
      setLoadingState('general', true);
      console.log("🔄 Scheduling interview:", interviewData);
      
      const response = await api.post("/recruiter/interviews", interviewData);
      
      if (response.data?.success) {
        const newInterview = response.data.data;
        setInterviews(prev => [...prev, newInterview]);
        return handleSuccess("Interview scheduled successfully", newInterview);
      } else {
        const errorMsg = response.data?.message || "Failed to schedule interview";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = handleError(err, "Failed to schedule interview");
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('general', false);
    }
  }, []);

  const fetchJobInterviews = useCallback(async (jobId) => {
    try {
      setLoadingState('interviews', true);
      console.log("🔄 Fetching interviews for job:", jobId);
      
      const response = await api.get(`/recruiter/interviews/jobs/${jobId}`);
      
      let interviewsData = [];
      if (response.data?.data) interviewsData = response.data.data;
      else if (Array.isArray(response.data)) interviewsData = response.data;
      
      setInterviews(interviewsData);
      return handleSuccess(`Loaded ${interviewsData.length} interviews`, interviewsData);
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch interviews");
      setInterviews([]);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('interviews', false);
    }
  }, []);

  // ==================== ANALYTICS ====================
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingState('analytics', true);
      console.log("🔄 Fetching analytics...");
      
      const response = await api.get("/recruiter/dashboard/stats");
      
      if (response.data?.success) {
        setAnalytics(response.data.data);
        return handleSuccess("Analytics loaded successfully", response.data.data);
      } else {
        setAnalytics(null);
        return handleSuccess("No analytics data available");
      }
    } catch (err) {
      const errorMsg = handleError(err, "Failed to fetch analytics");
      setAnalytics(null);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingState('analytics', false);
    }
  }, []);

  // ==================== UTILITIES ====================
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshAllData = useCallback(async () => {
    console.log("🔄 Refreshing all recruiter data...");
    await Promise.all([
      fetchRecruiterCompanies(),
      fetchRecruiterJobs(),
      fetchAnalytics()
    ]);
  }, [fetchRecruiterCompanies, fetchRecruiterJobs, fetchAnalytics]);

  // ==================== INITIAL DATA LOADING ====================
  useEffect(() => {
    const initializeData = async () => {
      console.log("🚀 Initializing recruiter data...");
      await fetchRecruiterCompanies();
      await fetchRecruiterJobs();
      await fetchAnalytics();
    };
    
    initializeData();
  }, [fetchRecruiterCompanies, fetchRecruiterJobs, fetchAnalytics]);

  // ==================== CONTEXT VALUE ====================
  const value = {
    // STATE
    jobs,
    candidates,
    interviews,
    recruiterCompanies,
    analytics,
    stats,
    loading,
    error,
    selectedJob,
    
    // ACTIONS - JOBS
    fetchRecruiterJobs,
    createJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    
    // ACTIONS - CANDIDATES
    fetchCandidates,
    updateCandidateStatus,
    
    // ACTIONS - INTERVIEWS
    scheduleInterview,
    fetchJobInterviews,
    
    // ACTIONS - COMPANIES & ANALYTICS
    fetchRecruiterCompanies,
    fetchAnalytics,
    
    // UTILITIES
    clearError,
    refreshAllData,
    
    // COMPUTED PROPERTIES
    hasJobs: jobs.length > 0,
    hasCandidates: candidates.length > 0,
    hasCompanies: recruiterCompanies.length > 0,
    hasMultipleCompanies: recruiterCompanies.length > 1,
    hasInterviews: interviews.length > 0,
    hasAnalytics: analytics !== null,
    
    // STATUS CHECKERS
    isJobsLoading: loading.jobs || loading.general,
    isCandidatesLoading: loading.candidates || loading.general,
    isCompaniesLoading: loading.companies,
    isInterviewsLoading: loading.interviews,
    isAnalyticsLoading: loading.analytics,
    isLoading: Object.values(loading).some(Boolean)
  };

  return (
    <RecruiterContext.Provider value={value}>
      {children}
    </RecruiterContext.Provider>
  );
};