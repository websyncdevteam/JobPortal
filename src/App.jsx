// src/App.jsx - UPDATED WITH VERIFICATION
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { useSelector } from "react-redux";
import './utils/authFix.js';

// Providers / Contexts
import { CandidatesProvider } from "./context/companyContext/CandidatesContext";
import { RecruiterProvider } from "./context/RecruiterContext";
import { AuthProvider } from "./context/authContext";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import VerificationRequired from "./components/common/VerificationRequired"; // ✅ ADD THIS
import Sidebar from "./components/company/layout/Sidebar";
import TopBar from "./components/company/layout/TopBar";
import NotificationCenter from "./components/company/layout/NotificationCenter";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminApplicants from "./components/admin/AdminApplicants";
import UserManager from "./components/admin/UserManager";
import UserProfilePage from "./components/admin/UserProfilePage";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import CompanyActivity from "./components/admin/CompanyActivity";
import CompanyAnalytics from "./components/admin/CompanyAnalytics";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import EditJob from "./components/admin/EditJob";
import RecruiterManagement from "./components/admin/RecruiterManagement";

// Recruiter
import RecruiterLayout from "./components/recruiter/RecruiterLayout";
import DashboardOverview from "./components/recruiter/DashboardOverview";
import JobManagement from "./components/recruiter/JobManagement";
import CandidateManagement from "./components/recruiter/CandidateManagement";
import InterviewScheduling from "./components/recruiter/InterviewScheduling";
import AnalyticsRecruiter from "./components/recruiter/Analytics";

// Company pages
import Dashboard from "./pages/Dashboard";
import JobCandidates from "./components/company/JobCandidates";
import Candidates from "./components/company/Candidates";
import CandidateProfile from "./components/company/CandidateProfile";
import AnalyticsCompany from "./components/company/Analytics";
import Settings from "./components/company/Settings";
import InterviewSlots from "./pages/InterviewSlots";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import VerifyEmail from './pages/VerifyEmail';
import CheckEmail from "./pages/CheckEmail"; // ✅ ADDED
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword.jsx';
import RecruiterSettings from "./components/recruiter/Settings";
// Freelancer pages
import FreelancerOnboarding from "./pages/freelancer/Onboarding";
import FreelancerDashboard from "./pages/freelancer/Dashboard";
import FreelancerProfile from "./pages/freelancer/Profile";

// Placements
import PlacementsList from "./pages/placements/Index";
import SubmitCandidate from "./pages/placements/SubmitCandidate";
import PlacementDetails from "./pages/placements/[id]";

// Public pages & auth
import Home from "./components/Home";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import SavedJobs from "./components/SavedJobs";
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import JoinFreelancer from './pages/JoinFreelancer';

// theme
const theme = createTheme({
  palette: {
    primary: { main: "#2563eb" },
    secondary: { main: "#8b5cf6" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#1e293b", secondary: "#64748b" },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
  shape: { borderRadius: 8 },
});

// ✅ NEW: VERIFICATION PROTECTION WRAPPER
function VerifiedRoute({ children, roles = [], adminExempt = true }) {
  const { user } = useSelector((s) => s.auth);
  
  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  // ✅ Check verification (admin is exempt by default)
  const isAdminExempt = adminExempt && user?.role === "admin";
  
  if (!isAdminExempt && user && !user.isVerified) {
    return <VerificationRequired email={user.email} />;
  }
  
  return children;
}

// COMPANY LAYOUT
function CompanyLayout() {
  const { user } = useSelector((s) => s.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  
  // ✅ Check verification for company users
  if (user.role !== "admin" && !user.isVerified) {
    return <VerificationRequired email={user.email} />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setNotificationsOpen={setNotificationsOpen}
      />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarOpen ? "240px" : "0px",
        }}
      >
        <Outlet />
      </Box>
      <NotificationCenter open={notificationsOpen} setOpen={setNotificationsOpen} />
    </Box>
  );
}

// FREELANCER LAYOUT
function FreelancerLayout() {
  const { user } = useSelector((s) => s.auth);
  
  // ✅ Check verification for freelancer
  if (user && !user.isVerified) {
    return <VerificationRequired email={user.email} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/freelancer/dashboard" className="text-xl font-bold text-purple-700">
              🚀 Freelancer Portal
            </Link>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/freelancer/dashboard" className="text-gray-700 hover:text-purple-600">
                Dashboard
              </Link>
              <Link to="/freelancer/earnings" className="text-gray-700 hover:text-purple-600">
                Earnings
              </Link>
              <Link to="/freelancer/placements" className="text-gray-700 hover:text-purple-600">
                Placements
              </Link>
              <Link to="/freelancer/profile" className="text-gray-700 hover:text-purple-600">
                Profile
              </Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

// Router
const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/company/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/description/:id", element: <JobDescription /> },
  { path: "/browse", element: <Browse /> },
  { path: "/about-us", element: <AboutUs /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/join-freelancer", element: <JoinFreelancer /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/check-email", element: <CheckEmail /> }, // ✅ ADDED
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  // ✅ Protected profile routes (require verification)
  { 
    path: "/profile", 
    element: (
      <ProtectedRoute allowedRoles={["candidate", "freelancer", "recruiter", "company", "admin"]}>
        <VerifiedRoute>
          <Profile />
        </VerifiedRoute>
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/saved-jobs", 
    element: (
      <ProtectedRoute allowedRoles={["candidate", "freelancer", "recruiter", "company", "admin"]}>
        <VerifiedRoute>
          <SavedJobs />
        </VerifiedRoute>
      </ProtectedRoute>
    ) 
  },

  // Admin routes (admin exempt from verification)
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <UserManager /> },
      { path: "users/create", element: <UserProfilePage mode="create" /> },
      { path: "users/:id", element: <UserProfilePage /> },
      { path: "companies", element: <Companies /> },
      { path: "companies/create", element: <CompanyCreate /> },
      { path: "companies/:id", element: <CompanySetup /> },
      { path: "companies/:id/activity", element: <CompanyActivity /> },
      { path: "companies/:id/analytics", element: <CompanyAnalytics /> },
      { path: "jobs", element: <AdminJobs /> },
      { path: "jobs/create", element: <PostJob /> },
      { path: "jobs/:jobId/edit", element: <EditJob /> },
      { path: "jobs/:jobId/applicants", element: <AdminApplicants /> },
      { path: "recruiters", element: <RecruiterManagement /> },
    ],
  },

  {
    path: "/manage-jobs/:jobId/edit",
    element: (
      <ProtectedRoute allowedRoles={["admin", "recruiter"]}>
        <VerifiedRoute adminExempt={true}>
          <EditJob />
        </VerifiedRoute>
      </ProtectedRoute>
    ),
  },

  // Recruiter routes (require verification)
  {
    path: "/recruiter",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <VerifiedRoute adminExempt={true}>
          <RecruiterProvider>
            <RecruiterLayout />
          </RecruiterProvider>
        </VerifiedRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "jobs", element: <JobManagement /> },
      { path: "candidates", element: <CandidateManagement /> },
      { path: "interviews", element: <InterviewScheduling /> },
      { path: "analytics", element: <AnalyticsRecruiter /> },
       { path: "settings", element: <Settings /> },
    ],
  },

  // Company routes (require verification)
  {
    path: "/company",
    element: (
      <ProtectedRoute allowedRoles={["company", "admin"]}>
        <VerifiedRoute adminExempt={true}>
          <CandidatesProvider>
            <CompanyLayout />
          </CandidatesProvider>
        </VerifiedRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "candidates", element: <Candidates /> },
      { path: "slots", element: <InterviewSlots /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "jobs/:jobId/candidates", element: <JobCandidates /> },
      { path: "candidates/:candidateId", element: <CandidateProfile /> },
      { path: "analytics", element: <AnalyticsCompany /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  

  // Freelancer routes (require verification)
  {
    path: "/freelancer",
    element: (
      <ProtectedRoute allowedRoles={["freelancer"]}>
        <VerifiedRoute>
          <FreelancerLayout />
        </VerifiedRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "onboarding", element: <FreelancerOnboarding /> },
      { path: "dashboard", element: <FreelancerDashboard /> },
      { path: "profile", element: <FreelancerProfile /> },
      { path: "placements", element: <PlacementsList /> },
      { path: "placements/submit", element: <SubmitCandidate /> },
      { path: "placements/:id", element: <PlacementDetails /> },
    ],
  },
  

  // fallback
  {
    path: "*",
    element: (
      <div style={{ padding: 24, textAlign: "center" }}>
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
      </div>
    ),
  },
]);

// Main App wrapper with AuthProvider
function AppWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default function App() {
  useEffect(() => {
    console.log("App mounted");
  }, []);

  return <AppWrapper />;
}