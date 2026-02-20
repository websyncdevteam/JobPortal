import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllAdminJobs } from "@/redux/jobSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com/api/v1';

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector((store) => store.job);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllAdminJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const res = await axios.get(`${API_BASE_URL}/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const jobs = res.data?.data || [];
      dispatch(setAllAdminJobs(jobs));
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching admin jobs:", err.response || err);
      dispatch(setAllAdminJobs([]));
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllAdminJobs();
  }, [fetchAllAdminJobs]);

  // Return refetch so AdminJobs.jsx keeps working
  return { jobs: allAdminJobs, loading, error, refetch: fetchAllAdminJobs };
};

export default useGetAllAdminJobs;
