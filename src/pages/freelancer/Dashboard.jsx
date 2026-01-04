import { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import useFreelancer from "@/hooks/useFreelancer";
import { toast } from "sonner";

const FreelancerDashboard = () => {
  const { user, isFreelancer } = useAuth();
  const { 
    dashboard, 
    loading, 
    error,
    loadDashboard 
  } = useFreelancer();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Refresh data every 2 minutes
  useEffect(() => {
    if (isFreelancer) {
      const interval = setInterval(() => {
        loadDashboard();
      }, 120000); // 2 minutes

      return () => clearInterval(interval);
    }
  }, [isFreelancer, loadDashboard]);

  if (loading.dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isFreelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <p className="text-red-500">Access denied. Freelancer role required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.fullname}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's your freelancer performance overview
              </p>
            </div>
            <button 
              onClick={loadDashboard}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value={`$${dashboard?.quickStats?.totalEarnings?.toLocaleString() || '0'}`}
            icon="💰"
            gradient="from-blue-500 to-blue-600"
            subtitle="Lifetime commission"
          />
          <StatCard
            title="Active Placements"
            value={dashboard?.quickStats?.activePlacements || '0'}
            icon="📊"
            gradient="from-green-500 to-green-600"
            subtitle="In progress"
          />
          <StatCard
            title="Success Rate"
            value={`${dashboard?.quickStats?.successRate || '0'}%`}
            icon="🎯"
            gradient="from-purple-500 to-purple-600"
            subtitle="Placement ratio"
          />
          <StatCard
            title="Total Submissions"
            value={dashboard?.quickStats?.totalSubmissions || '0'}
            icon="📝"
            gradient="from-orange-500 to-orange-600"
            subtitle="Candidates submitted"
          />
        </div>

        {/* Recent Placements & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Placements */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>🔄</span> Recent Placements
              </h2>
              <button 
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                onClick={() => window.location.href = '/freelancer/placements'}
              >
                View All
              </button>
            </div>
            
            {dashboard?.recentPlacements?.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentPlacements.slice(0, 5).map((placement) => (
                  <PlacementCard key={placement._id} placement={placement} />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon="📋"
                title="No placements yet"
                description="Start by submitting your first candidate"
                action={() => window.location.href = '/freelancer/placements/submit'}
                actionText="Submit Candidate"
              />
            )}
          </div>

          {/* Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <span>⚡</span> Quick Actions
              </h2>
              <div className="space-y-3">
                <ActionButton
                  icon="👤"
                  label="Submit New Candidate"
                  onClick={() => window.location.href = '/freelancer/placements/submit'}
                  primary
                />
                <ActionButton
                  icon="📋"
                  label="View All Placements"
                  onClick={() => window.location.href = '/freelancer/placements'}
                />
                <ActionButton
                  icon="💰"
                  label="Check Earnings"
                  onClick={() => window.location.href = '/freelancer/earnings'}
                />
                <ActionButton
                  icon="💳"
                  label="Request Payout"
                  onClick={() => window.location.href = '/freelancer/payouts'}
                />
              </div>
            </div>

            {/* Notifications */}
            {dashboard?.notifications?.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <span>🔔</span> Notifications
                </h2>
                <div className="space-y-3">
                  {dashboard.notifications.slice(0, 3).map((notification, index) => (
                    <NotificationCard key={index} notification={notification} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pending Payouts */}
        {dashboard?.pendingPayouts?.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2 mb-4">
              <span>⏳</span> Pending Payouts
            </h2>
            <div className="space-y-3">
              {dashboard.pendingPayouts.slice(0, 3).map((payout) => (
                <PayoutCard key={payout._id} payout={payout} />
              ))}
            </div>
          </div>
        )}

        {/* Performance Chart Placeholder */}
        {dashboard?.stats?.monthlyTrend && dashboard.stats.monthlyTrend.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span>📈</span> Performance Trend
            </h2>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Performance chart visualization</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component: Stat Card
const StatCard = ({ title, value, icon, gradient, subtitle }) => (
  <div className={`bg-gradient-to-r ${gradient} text-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-blue-100 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subtitle && (
          <p className="text-blue-200 text-xs mt-1">{subtitle}</p>
        )}
      </div>
      <div className="text-3xl opacity-90">{icon}</div>
    </div>
  </div>
);

// Component: Placement Card
const PlacementCard = ({ placement }) => {
  const getStatusColor = (status) => {
    const colors = {
      joined: 'bg-green-100 text-green-800',
      interview_scheduled: 'bg-blue-100 text-blue-800',
      offer_made: 'bg-yellow-100 text-yellow-800',
      submitted: 'bg-gray-100 text-gray-800',
      under_review: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">
          {placement.candidateDetails?.name || 'Unknown Candidate'}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {placement.jobDetails?.title || placement.jobId?.title}
        </p>
        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getStatusColor(placement.status)}`}>
          {placement.status?.replace(/_/g, ' ') || 'Submitted'}
        </span>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          ${placement.commissionStructure?.calculatedAmount || '0'}
        </p>
        <p className="text-sm text-gray-600">Commission</p>
      </div>
    </div>
  );
};

// Component: Action Button
const ActionButton = ({ icon, label, onClick, primary = false }) => (
  <button 
    className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
      primary 
        ? 'bg-purple-600 text-white hover:bg-purple-700' 
        : 'border border-gray-300 bg-white hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

// Component: Notification Card
const NotificationCard = ({ notification }) => (
  <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <span className="text-lg mt-1">
      {notification.type === 'interview' ? '🎯' : '💰'}
    </span>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(notification.date).toLocaleDateString()}
      </p>
    </div>
  </div>
);

// Component: Payout Card
const PayoutCard = ({ payout }) => (
  <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
    <div>
      <p className="font-semibold text-orange-900">${payout.amount}</p>
      <p className="text-sm text-orange-700 capitalize">{payout.status}</p>
    </div>
    <button className="px-3 py-1 border border-orange-300 rounded text-sm text-orange-700 hover:bg-orange-200 transition-colors">
      View Details
    </button>
  </div>
);

// Component: Empty State
const EmptyState = ({ icon, title, description, action, actionText }) => (
  <div className="text-center py-8">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {action && (
      <button 
        onClick={action}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        {actionText}
      </button>
    )}
  </div>
);

export default FreelancerDashboard;