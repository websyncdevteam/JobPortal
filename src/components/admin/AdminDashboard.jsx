// src/components/admin/AdminDashboard.jsx - UPDATED
import { useEffect, useState } from "react";
import api from "@/services/api";
import Card from "../ui/StatCard";
import { 
  Briefcase, 
  Users, 
  User, 
  FileText, 
  ClipboardList,
  Building
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      
      if (response.data.success) {
        const data = response.data.data || {};
        setStats({
          totalUsers: data.totalUsers || 0,
          totalCandidates: data.totalCandidates || 0,
          totalRecruiters: data.totalRecruiters || 0,
          totalJobs: data.totalJobs || 0,
          totalApplications: data.totalApplications || 0,
          totalCompanies: data.totalCompanies || 0
        });
      } else {
        toast.error("Failed to load admin stats.");
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
      // Don't show toast for 401 - interceptor handles it
      if (err.response?.status !== 401) {
        toast.error("Error fetching dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="h-5 w-5" />}
            color="bg-blue-100"
            textColor="text-blue-900"
          />
          <Card
            title="Candidates"
            value={stats.totalCandidates}
            icon={<User className="h-5 w-5" />}
            color="bg-green-100"
            textColor="text-green-900"
          />
          <Card
            title="Recruiters"
            value={stats.totalRecruiters}
            icon={<Briefcase className="h-5 w-5" />}
            color="bg-purple-100"
            textColor="text-purple-900"
          />
          <Card
            title="Companies"
            value={stats.totalCompanies}
            icon={<Building className="h-5 w-5" />}
            color="bg-indigo-100"
            textColor="text-indigo-900"
          />
          <Card
            title="Jobs"
            value={stats.totalJobs}
            icon={<FileText className="h-5 w-5" />}
            color="bg-yellow-100"
            textColor="text-yellow-900"
          />
          <Card
            title="Applications"
            value={stats.totalApplications}
            icon={<ClipboardList className="h-5 w-5" />}
            color="bg-orange-100"
            textColor="text-orange-900"
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;