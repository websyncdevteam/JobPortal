import React, { useEffect } from 'react';
import { useRecruiter } from '../../context/RecruiterContext';
import { Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Analytics = () => {
  const { analytics, loading, fetchAnalytics } = useRecruiter(); // Changed to fetchAnalytics and analytics

  useEffect(() => {
    fetchAnalytics(); // Changed to fetchAnalytics
  }, [fetchAnalytics]);

  if (loading.analytics || loading.general) { // Updated loading check
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No analytics data available
        </h3>
        <p className="text-gray-500">
          Post jobs and receive applications to see analytics here.
        </p>
      </div>
    );
  }

  // Use analytics data structure
  const stats = analytics.stats || analytics;
  const statusCounts = stats.statusCounts || {
    new: 0,
    reviewed: 0,
    interview: 0,
    hired: 0,
    rejected: 0
  };

  const pieData = [
    { name: 'New', value: statusCounts.new || 0 },
    { name: 'Reviewed', value: statusCounts.reviewed || 0 },
    { name: 'Interview', value: statusCounts.interview || 0 },
    { name: 'Hired', value: statusCounts.hired || 0 },
    { name: 'Rejected', value: statusCounts.rejected || 0 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Recruiter Analytics</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-gray-500 font-medium">Jobs Posted</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalJobs || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-gray-500 font-medium">Applications</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalApplications || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-gray-500 font-medium">Hired</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalHired || stats.hiredCandidates || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-gray-500 font-medium">Pending Interviews</h2>
          <p className="text-3xl font-bold mt-2">{stats.pendingInterviews || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart for application statuses */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Applications by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart for jobs vs applications */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Applications per Job</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.jobs || analytics.jobs || []}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;