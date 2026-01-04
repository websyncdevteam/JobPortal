import { useState, useCallback } from 'react';
import placementService from '@/services/placementService';
import { toast } from 'sonner';

const usePlacements = () => {
  const [placements, setPlacements] = useState({
    data: [],
    pagination: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch placements with filters
  const fetchPlacements = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placementService.getPlacements(filters);
      setPlacements(result.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get placement details
  const getPlacementDetails = useCallback(async (placementId) => {
    try {
      const result = await placementService.getPlacementDetails(placementId);
      return result.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  // Submit candidate
  const submitCandidate = useCallback(async (candidateData) => {
    try {
      const result = await placementService.submitCandidate(candidateData);
      toast.success(result.message || 'Candidate submitted successfully!');
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  // Withdraw placement
  const withdrawPlacement = useCallback(async (placementId, reason) => {
    try {
      const result = await placementService.withdrawPlacement(placementId, reason);
      toast.success(result.message || 'Placement withdrawn successfully!');
      
      // Refresh placements
      await fetchPlacements();
      
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [fetchPlacements]);

  // Get available jobs
  const getAvailableJobs = useCallback(async (filters = {}) => {
    try {
      const result = await placementService.getAvailableJobs(filters);
      return result.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  // Get placement stats
  const getPlacementStats = useCallback(async () => {
    try {
      const result = await placementService.getPlacementStats();
      return result.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  return {
    // Data
    placements: placements.data,
    pagination: placements.pagination,
    
    // Loading states
    loading,
    
    // Errors
    error,
    
    // Actions
    fetchPlacements,
    getPlacementDetails,
    submitCandidate,
    withdrawPlacement,
    getAvailableJobs,
    getPlacementStats
  };
};

export default usePlacements;