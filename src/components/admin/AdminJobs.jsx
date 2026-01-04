import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import Navbar from "../shared/Navbar";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { useDispatch, useSelector } from "react-redux";
import { setAllAdminJobs } from "@/redux/jobSlice";

const AdminJobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobs, loading, error } = useGetAllAdminJobs(); // refetch not needed anymore
  const [searchText, setSearchText] = useState("");

  // 🔍 Filter jobs by search
  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    // ✅ Optimistically remove job from Redux
    const prevJobs = [...jobs];
    const updatedJobs = jobs.filter((job) => job._id !== jobId);
    dispatch(setAllAdminJobs(updatedJobs));

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/v1/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }
    } catch (err) {
      console.error("❌ Failed to delete job:", err);
      // ❌ Rollback if delete fails
      dispatch(setAllAdminJobs(prevJobs));
      alert("Failed to delete job. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Manage Jobs
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/manage-jobs/create")}
          >
            + Create Job
          </Button>
        </Box>

        {/* Loading/Error */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">
            {error.message || "Failed to fetch jobs"}
          </Typography>
        ) : filteredJobs.length === 0 ? (
          <Typography>No jobs found.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Company</b></TableCell>
                  <TableCell><b>Title</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell align="right"><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>{job.company?.name || "N/A"}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/manage-jobs/${job._id}/edit`)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        sx={{ mr: 1 }}
                      >
                        View Applicants
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(job._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default AdminJobs;
