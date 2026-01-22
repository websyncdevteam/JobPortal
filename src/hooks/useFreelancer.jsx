import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import freelancerService from '@/services/freelancer/freelancerService';
import { toast } from 'sonner';

const useFreelancer = () => {
  const { user, isFreelancer } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    dashboard: false,
    placements: false
  });
  const [error, setError] = useState(null);

  // Load freelancer profile
  const loadProfile = useCallback(async () => {
    if (!isFreelancer) return;
    
    setLoading(prev => ({ ...prev, profile: true }));
    setError(null);
    
    try {
      const result = await freelancerService.getProfile();
      setProfile(result.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, [isFreelancer]);

  // Load dashboard data
  const loadDashboard = useCallback(async () => {
    if (!isFreelancer) return;
    
    setLoading(prev => ({ ...prev, dashboard: true }));
    setError(null);
    
    try {
      const result = await freelancerService.getDashboard();
      setDashboard(result.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  }, [isFreelancer]);

  // Load placements with filters
  const loadPlacements = useCallback(async (filters = {}) => {
    if (!isFreelancer) return;
    
    setLoading(prev => ({ ...prev, placements: true }));
    setError(null);
    
    try {
      const result = await freelancerService.getPlacements(filters);
      setPlacements(result.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(prev => ({ ...prev, placements: false }));
    }
  }, [isFreelancer]);

  // Submit candidate
  const submitCandidate = useCallback(async (candidateData) => {
    if (!isFreelancer) return;
    
    try {
      const result = await freelancerService.submitCandidate(candidateData);
      toast.success(result.message || 'Candidate submitted successfully!');
      
      // Refresh dashboard and placements
      await Promise.all([loadDashboard(), loadPlacements()]);
      
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [isFreelancer, loadDashboard, loadPlacements]);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    if (!isFreelancer) return;
    
    try {
      const result = await freelancerService.updateProfile(profileData);
      setProfile(result.data);
      toast.success('Profile updated successfully!');
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [isFreelancer]);

  // Load initial data
  useEffect(() => {
    if (isFreelancer) {
      loadProfile();
      loadDashboard();
      loadPlacements();
    }
  }, [isFreelancer, loadProfile, loadDashboard, loadPlacements]);

  return {
    // Data
    profile,
    dashboard,
    placements,
    
    // Loading states
    loading,
    
    // Errors
    error,
    
    // Actions
    loadProfile,
    loadDashboard,
    loadPlacements,
    submitCandidate,
    updateProfile,
    
    // Derived state
    isReady: !loading.profile && !loading.dashboard,
    hasData: !!profile && !!dashboard
  };
};

export default useFreelancer;