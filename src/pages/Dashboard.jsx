// src/pages/Dashboard.jsx - UPDATED WITH ENV VARIABLE FOR API URL
import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  LinearProgress,
  Snackbar
} from "@mui/material";
import {
  Visibility,
  Schedule,
  People,
  Work,
  Notifications,
  Refresh,
  TrendingUp,
  AssignmentTurnedIn,
  Error as ErrorIcon,
  CheckCircle
} from "@mui/icons-material";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import StatsCards from "../components/company/dashboard/StatsCards";
import LoadingSpinner from "../components/company/common/LoadingSpinner";

// API Base URL from environment or fallback to production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com/api/v1';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState("week");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [retryCount, setRetryCount] = useState(0);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const getDemoData = () => ({
    company: {
      name: user?.company?.name || "Demo Company",
      email: user?.email || "company@example.com",
      status: "active"
    },
    jobs: [
      {
        _id: "1",
        title: "Frontend Developer",
        status: "active",
        applicantCount: 45,
        interviewCount: 12,
        selectedCount: 3,
        recruiterName: "John Recruiter",
        createdAt: new Date()
      },
      {
        _id: "2",
        title: "Backend Engineer",
        status: "active",
        applicantCount: 32,
        interviewCount: 8,
        selectedCount: 2,
        recruiterName: "Sarah Recruiter",
        createdAt: new Date()
      }
    ],
    stats: {
      totalJobs: 2,
      activeJobs: 2,
      totalApplications: 77,
      newApplications: 24,
      interviewing: 20,
      selected: 5,
      upcomingInterviews: 3,
      totalRecruiters: 2,
      activeRecruiters: 2
    },
    upcomingInterviews: [
      {
        _id: "1",
        applicant: {
          fullname: "John Doe",
          email: "john@example.com",
          profile: { profilePhoto: null }
        },
        job: { title: "Frontend Developer" },
        interviewSlot: {
          confirmedDate: new Date(Date.now() + 86400000).toISOString()
        },
        status: "company_first_round"
      }
    ],
    recentActivity: [
      {
        _id: "1",
        applicant: { fullname: "Jane Smith" },
        job: { title: "Backend Engineer" },
        status: "selected",
        lastStatusUpdate: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    recruiters: [
      { fullname: "John Recruiter", email: "john@recruiter.com", status: "active" },
      { fullname: "Sarah Recruiter", email: "sarah@recruiter.com", status: "active" }
    ]
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log("🔍 [Dashboard] Starting data fetch...");
      console.log("👤 Current user:", user);
      
      // Debug: Check all possible token keys
      const allKeys = Object.keys(localStorage);
      const tokenKeys = allKeys.filter(key => key.toLowerCase().includes('token'));
      console.log("🔑 Available token keys:", tokenKeys);
      
      tokenKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`🔑 ${key}:`, value ? `${value.substring(0, 30)}...` : "Empty");
      });
      
      // Try multiple possible token keys (order matters - try authToken first based on logs)
      const token = localStorage.getItem("authToken") || 
                    localStorage.getItem("token") || 
                    localStorage.getItem("auth-token");
      
      console.log("✅ Selected token:", token ? `Bearer ${token.substring(0, 20)}...` : "None");
      
      if (!token) {
        showSnackbar("No authentication token found. Please login again.", "error");
        throw new Error("No authentication token found in localStorage");
      }

      // Check if backend is accessible first
      try {
        const healthCheck = await fetch(`${API_BASE_URL}/health`);
        console.log("🏥 Backend health check:", healthCheck.status, healthCheck.ok);
      } catch (healthError) {
        console.error("❌ Backend server not reachable:", healthError);
        showSnackbar("Backend server is not running. Please start the server.", "error");
        throw new Error("Backend server not reachable");
      }

      console.log(`🔄 Fetching dashboard from: ${API_BASE_URL}/company/workflow/dashboard`);
      
      const response = await fetch(`${API_BASE_URL}/company/workflow/dashboard`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-User-Email": user?.email || "",
          "X-User-Role": user?.role || ""
        },
        credentials: "include"
      });
      
      console.log("📊 Response status:", response.status, response.statusText);
      console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log("📝 Raw response (first 500 chars):", responseText.substring(0, 500));
      
      if (!response.ok) {
        console.error("❌ Server error response:", responseText);
        
        if (response.status === 401) {
          showSnackbar("Session expired. Please login again.", "error");
          logout();
          navigate("/login");
          return;
        } else if (response.status === 404) {
          showSnackbar("Dashboard endpoint not found. Check backend routes.", "warning");
          throw new Error("Endpoint not found (404). Check if backend route is registered.");
        } else if (response.status === 403) {
          showSnackbar("Access denied. You don't have permission to view dashboard.", "error");
          throw new Error("Access denied (403)");
        } else if (response.status === 500) {
          showSnackbar("Server error. Please try again later.", "error");
          throw new Error(`Server error (500): ${responseText.substring(0, 100)}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      // Try to parse JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse JSON:", parseError);
        throw new Error("Server returned invalid JSON. Check backend response.");
      }
      
      console.log("✅ Parsed response:", result);
      
      if (result.success) {
        setDashboardData(result.data);
        setRetryCount(0);
        showSnackbar("Dashboard data loaded successfully", "success");
      } else {
        throw new Error(result.message || "Failed to load dashboard data");
      }
    } catch (error) {
      console.error("❌ Failed to fetch dashboard:", error);
      setError(error.message);
      
      // Use demo data after 2 retries or if server is down
      if (retryCount >= 2 || error.message.includes("not reachable")) {
        showSnackbar("Using demo data. Backend connection failed.", "warning");
        setDashboardData(getDemoData());
      } else {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualRetry = () => {
    console.log("🔄 Manual retry triggered");
    fetchDashboardData();
  };

  const handleTestBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      showSnackbar(`Backend: ${data.message}`, "success");
      console.log("🏥 Backend test:", data);
    } catch (error) {
      showSnackbar("Backend server not running", "error");
    }
  };

  const handleCheckAuth = () => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    showSnackbar(
      token ? `Token found (${token.length} chars)` : "No token found", 
      token ? "success" : "error"
    );
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading && !dashboardData) {
    return (
      <Box sx={{ width: '100%', p: 3, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Loading dashboard data...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Attempt {retryCount + 1} of 3
        </Typography>
        <LinearProgress sx={{ mt: 2, width: '60%', mx: 'auto' }} />
      </Box>
    );
  }

  const { 
    company = {}, 
    jobs = [], 
    stats = {}, 
    upcomingInterviews = [], 
    recentActivity = [],
    recruiters = []
  } = dashboardData || getDemoData();

  const isDemoData = dashboardData && dashboardData.company?.name === "Demo Company";

  return (
    <Box>
      {/* DEBUG PANEL - Remove in production */}
      <Card sx={{ mb: 3, bgcolor: 'background.default', border: '1px dashed', borderColor: 'warning.main' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="warning.dark">
              🐛 Debug Panel
            </Typography>
            <Box>
              <Button size="small" onClick={handleTestBackend} sx={{ mr: 1 }}>
                Test Backend
              </Button>
              <Button size="small" onClick={handleCheckAuth} sx={{ mr: 1 }}>
                Check Auth
              </Button>
              <Button size="small" onClick={() => console.log("User:", user)}>
                Log User
              </Button>
            </Box>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>Error:</strong> {error}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {company.name} Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your hiring.
          </Typography>
          {isDemoData && (
            <Chip 
              label="Demo Mode" 
              color="warning" 
              size="small" 
              icon={<ErrorIcon />}
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Box>
            <Chip
              label="This Week"
              variant={timeRange === "week" ? "filled" : "outlined"}
              onClick={() => setTimeRange("week")}
              sx={{ mr: 1 }}
            />
            <Chip
              label="This Month"
              variant={timeRange === "month" ? "filled" : "outlined"}
              onClick={() => setTimeRange("month")}
              sx={{ mr: 1 }}
            />
            <Chip
              label="All Time"
              variant={timeRange === "all" ? "filled" : "outlined"}
              onClick={() => setTimeRange("all")}
            />
          </Box>
          
          <Tooltip title="Refresh Dashboard">
            <IconButton onClick={fetchDashboardData}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            startIcon={<Schedule />}
            onClick={() => navigate("/company/slots")}
          >
            Manage Slots
          </Button>
        </Box>
      </Box>

      {/* INFO ALERT */}
      {isDemoData && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleManualRetry}>
              Retry Connection
            </Button>
          }
        >
          Showing demo data. Real backend connection failed. Check if server is running on port 3000.
        </Alert>
      )}

      {/* STATS CARDS */}
      <StatsCards stats={stats} />

      {/* JOBS TABLE */}
      <Card sx={{ mt: 3, mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Jobs Posted for Your Company
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {stats.totalJobs || 0} jobs • Active: {stats.activeJobs || 0}
            </Typography>
          </Box>
          
          {jobs.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Applicants</TableCell>
                    <TableCell align="center">Interviews</TableCell>
                    <TableCell align="center">Selected</TableCell>
                    <TableCell align="center">Posted By</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job._id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created: {new Date(job.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.status || "active"}
                          color={job.status === "active" ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <People sx={{ mr: 1, color: "primary.main" }} />
                          <Typography fontWeight="bold">
                            {job.applicantCount || 0}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold" color="warning.main">
                          {job.interviewCount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold" color="success.main">
                          {job.selectedCount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {job.recruiterName || "Recruiter"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Candidates">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/company/jobs/${job._id}/candidates`)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box textAlign="center" py={4}>
              <Work sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Jobs Posted Yet
              </Typography>
              <Typography color="text.secondary" mb={3}>
                Recruiters will post jobs for your company. Check back soon!
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/company/candidates")}
              >
                View Candidates
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* UPCOMING INTERVIEWS & ACTIVITY */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Upcoming Interviews
                </Typography>
                <Chip
                  label={`${upcomingInterviews.length} scheduled`}
                  color="primary"
                  size="small"
                />
              </Box>
              
              {upcomingInterviews.length > 0 ? (
                <Box>
                  {upcomingInterviews.slice(0, 5).map((interview) => (
                    <Box
                      key={interview._id}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: "action.hover",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "action.selected"
                        }
                      }}
                      onClick={() => navigate(`/company/candidates/${interview._id}`)}
                    >
                      <Box>
                        <Typography fontWeight="medium">
                          {interview.applicant?.fullname || "Candidate"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {interview.job?.title || "Job"} • 
                          {interview.interviewSlot?.confirmedDate ? 
                            ` ${new Date(interview.interviewSlot.confirmedDate).toLocaleDateString()}` : 
                            " Date TBD"}
                        </Typography>
                      </Box>
                      <Chip
                        label={interview.status?.replace("company_", "").replace("_", " ") || "Scheduled"}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  ))}
                  
                  {upcomingInterviews.length > 5 && (
                    <Button
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate("/company/candidates")}
                    >
                      View All Interviews
                    </Button>
                  )}
                </Box>
              ) : (
                <Box textAlign="center" py={3}>
                  <Schedule sx={{ fontSize: 40, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    No upcoming interviews scheduled
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/company/slots")}
                  >
                    Create Interview Slots
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* RECENT ACTIVITY */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Activity
                </Typography>
                <AssignmentTurnedIn color="action" />
              </Box>
              
              {recentActivity.length > 0 ? (
                <Box>
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <Box
                      key={activity._id || index}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderLeft: 3,
                        borderColor: "primary.main",
                        bgcolor: "background.default"
                      }}
                    >
                      <Typography variant="body2">
                        <strong>{activity.applicant?.fullname || "Candidate"}</strong> • {activity.job?.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status changed to {activity.status} • 
                        {activity.lastStatusUpdate ? 
                          ` ${new Date(activity.lastStatusUpdate).toLocaleDateString()}` : 
                          " Recently"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" align="center" py={3}>
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* RECRUITERS */}
      {recruiters.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Recruiters ({stats.activeRecruiters}/{stats.totalRecruiters} active)
            </Typography>
            <Grid container spacing={2}>
              {recruiters.map((recruiter, index) => (
                <Grid item xs={12} sm={6} md={4} key={recruiter._id || index}>
                  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <People color="primary" />
                    <Box>
                      <Typography fontWeight="medium">
                        {recruiter.fullname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {recruiter.email}
                      </Typography>
                      <Chip
                        label={recruiter.status}
                        size="small"
                        color={recruiter.status === "active" ? "success" : "default"}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* SNACKBAR FOR NOTIFICATIONS */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.severity === 'success' ? <CheckCircle /> : <ErrorIcon />}
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: snackbar.severity === 'error' ? '#d32f2f' : 
                           snackbar.severity === 'warning' ? '#ed6c02' : 
                           snackbar.severity === 'success' ? '#2e7d32' : '#1976d2'
          }
        }}
      />
    </Box>
  );
};

export default Dashboard;
