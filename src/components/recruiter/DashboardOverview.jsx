import React from 'react';
import { Briefcase, Users, Calendar, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { useRecruiter } from '../../context/RecruiterContext';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardOverview = () => {
  const { stats, loading, error, fetchAnalytics } = useRecruiter();

  // Show loader while fetching dashboard data
  if (loading.dashboard) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-600" size={40} />
        <span className="ml-3 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  // Show error with retry button
  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Briefcase size={32} className="text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load data</h3>
        <p className="text-gray-500">{error || 'Could not fetch dashboard statistics'}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  // Stats are available – display real numbers
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs || 0}
          icon={<Briefcase size={24} className="text-indigo-600" />}
          color="bg-indigo-100"
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants || 0}
          icon={<Users size={24} className="text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Upcoming Interviews"
          value={stats.upcomingInterviews || 0}
          icon={<Calendar size={24} className="text-amber-600" />}
          color="bg-amber-100"
        />
        <StatCard
          title="Hired Candidates"
          value={stats.hiredCandidates || 0}
          icon={<CheckCircle size={24} className="text-emerald-600" />}
          color="bg-emerald-100"
        />
      </div>

      {/* Optional: Real recent activity or placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
        <p className="text-gray-500">
          {stats.totalApplicants > 0
            ? `You have received ${stats.totalApplicants} applications across your active jobs.`
            : 'No applications yet. Start posting jobs to see activity here.'}
        </p>
      </div>
    </div>
  );
};

export default DashboardOverview;
