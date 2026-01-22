import { useState, useCallback } from 'react';
import placementService from '@/services/placementService';
import { toast } from 'sonner';

const useJobs = () => {
  const [jobs, setJobs] = useState({
    data: [],
    pagination: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available jobs
  const fetchAvailableJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placementService.getAvailableJobs(filters);
      setJobs(result.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search jobs
  const searchJobs = useCallback(async (searchTerm, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placementService.getAvailableJobs({
        search: searchTerm,
        ...filters
      });
      setJobs(result.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    jobs: jobs.data,
    pagination: jobs.pagination,
    
    // Loading states
    loading,
    
    // Errors
    error,
    
    // Actions
    fetchAvailableJobs,
    searchJobs
  };
};

export default useJobs;