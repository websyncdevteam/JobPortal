import React from 'react';
import { Briefcase, Users, Calendar, CheckCircle, Loader } from 'lucide-react';
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

const RecentActivityItem = ({ title, description, time }) => (
  <div className="flex py-3 border-b border-gray-100 last:border-0">
    <div className="flex-shrink-0 mr-3">
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
        <Users size={18} className="text-indigo-600" />
      </div>
    </div>
    <div className="min-w-0">
      <p className="font-medium text-gray-900 truncate">{title}</p>
      <p className="text-sm text-gray-500 truncate">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

const DashboardOverview = () => {
  const { stats, loading } = useRecruiter();

  // Show loader if data is loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-600" size={40} />
        <span className="ml-3">Loading dashboard data...</span>
      </div>
    );
  }

  // Show message if stats are not available
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Briefcase size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No data available</h3>
        <p className="text-gray-500">We couldn't load your dashboard statistics</p>
        <button 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

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
          title="Interviews" 
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Recent Applications</h3>
          <div className="space-y-2">
            <RecentActivityItem 
              title="John Doe applied for Senior Developer"
              description="5 years experience, React, Node.js"
              time="2 hours ago"
            />
            <RecentActivityItem 
              title="Sarah Johnson applied for UX Designer"
              description="Portfolio attached, 3 years experience"
              time="4 hours ago"
            />
            <RecentActivityItem 
              title="Michael Chen applied for Backend Engineer"
              description="Python, Django, AWS certified"
              time="1 day ago"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Upcoming Interviews</h3>
          <div className="space-y-2">
            <RecentActivityItem 
              title="Technical Interview - John Doe"
              description="Senior Developer position"
              time="Today, 2:30 PM"
            />
            <RecentActivityItem 
              title="HR Interview - Sarah Johnson"
              description="UX Designer position"
              time="Tomorrow, 10:00 AM"
            />
            <RecentActivityItem 
              title="Final Interview - Michael Chen"
              description="Backend Engineer position"
              time="June 15, 11:00 AM"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;