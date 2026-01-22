import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAllAppliedJobs } from "@/redux/jobSlice";

const useGetAppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/v1/auth/refresh-token', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken);
          return data.accessToken;
        }
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
    }
    return null;
  };

  const fetchAppliedJobs = useCallback(async (isRetry = false) => {
    setLoading(true);
    setError(null);
    
    try {
      let token = localStorage.getItem('token');
      
      if (isRetry && token) {
        console.log("🔄 Attempting token refresh...");
        const newToken = await refreshToken();
        if (newToken) {
          token = newToken;
          console.log("✅ Token refreshed");
        }
      }
      
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }
      
      console.log("🔐 Using token:", token.substring(0, 20) + "...");
      
      const response = await fetch(`${APPLICATION_API_END_POINT}/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Response status:", response.status);
      
      if (response.status === 401) {
        if (!isRetry) {
          console.log("🔄 Token expired, retrying with refresh...");
          return fetchAppliedJobs(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError("Session expired. Please login again.");
          window.location.href = '/login';
          return;
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.success) {
        const jobs = data.applications || [];
        setAppliedJobs(jobs);
        dispatch(setAllAppliedJobs(jobs));
        
        console.log(`✅ Loaded ${jobs.length} applied jobs and saved to Redux`);
      } else {
        setError(data.message || "Failed to load");
      }
      
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  return {
    appliedJobs,
    loading,
    error,
    refetch: () => fetchAppliedJobs(),
    hasAppliedJobs: appliedJobs.length > 0
  };
};

export default useGetAppliedJobs;