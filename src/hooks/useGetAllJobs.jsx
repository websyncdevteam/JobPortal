import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import { jobService } from "@/services/jobService";

const useGetAllJobs = (filters = {}, page = 1, limit = 6) => {
  const dispatch = useDispatch();
  const { allJobs } = useSelector((store) => store.job);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getAllJobs({ ...filters, page, limit });
      dispatch(setAllJobs(data.data || []));
      setHasMore((data.data || []).length === limit);
      setError(null);
    } catch (err) {
      console.error("❌ Failed to fetch jobs:", err);
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [dispatch, JSON.stringify(filters), page, limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs: allJobs, loading, error, hasMore, refetch: fetchJobs };
};

export default useGetAllJobs;
