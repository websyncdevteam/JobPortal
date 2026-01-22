// frontend/src/components/recruiter/ActivityTimelineUI.jsx
// ACTIVITY TIMELINE UI - PURE UI/UX ENHANCEMENT
// Timeline display of existing activity data

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  User,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  Tag,
  Zap,
  Filter,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';

const ActivityTimelineUI = ({ 
  activities = [],
  isLoading = false,
  onFilterChange = () => {},
  onExport = () => {}
}) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'list'
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    user: 'all'
  });

  // If no activities provided, use sample data for demonstration
  const sampleActivities = [
    {
      id: 1,
      type: 'candidate_added',
      title: 'New candidate applied',
      description: 'John Doe applied for Senior Developer position',
      user: { name: 'System', role: 'auto' },
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      metadata: {
        candidate: 'John Doe',
        job: 'Senior Developer',
        status: 'new'
      },
      icon: User,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'interview_scheduled',
      title: 'Interview scheduled',
      description: 'Technical interview scheduled with Sarah Johnson',
      user: { name: 'Jane Smith', role: 'recruiter' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      metadata: {
        candidate: 'Sarah Johnson',
        position: 'UX Designer',
        date: '2024-01-20 14:30',
        interviewers: ['Mike Brown', 'Anna Lee']
      },
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      id: 3,
      type: 'status_changed',
      title: 'Candidate status updated',
      description: 'Michael Chen moved from Reviewed to Interview stage',
      user: { name: 'Robert Wilson', role: 'hiring-manager' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      metadata: {
        candidate: 'Michael Chen',
        from: 'reviewed',
        to: 'interview',
        notes: 'Strong technical background'
      },
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      id: 4,
      type: 'email_sent',
      title: 'Email sent to candidate',
      description: 'Interview confirmation sent to David Wilson',
      user: { name: 'System', role: 'auto' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      metadata: {
        candidate: 'David Wilson',
        template: 'Interview Confirmation',
        recipients: ['david@example.com']
      },
      icon: Mail,
      color: 'bg-amber-500'
    },
    {
      id: 5,
      type: 'note_added',
      title: 'Note added to candidate',
      description: 'Added private notes about cultural fit assessment',
      user: { name: 'Lisa Wong', role: 'recruiter' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      metadata: {
        candidate: 'Emma Garcia',
        notes: 'Excellent communication skills, strong cultural fit',
        private: true
      },
      icon: MessageSquare,
      color: 'bg-indigo-500'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : sampleActivities;

  // Activity type options
  const activityTypes = [
    { id: 'all', label: 'All Activities', icon: Zap, color: 'bg-gray-100 text-gray-800' },
    { id: 'candidate_added', label: 'New Candidates', icon: User, color: 'bg-blue-100 text-blue-800' },
    { id: 'status_changed', label: 'Status Changes', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { id: 'interview_scheduled', label: 'Interviews', icon: Calendar, color: 'bg-purple-100 text-purple-800' },
    { id: 'email_sent', label: 'Emails', icon: Mail, color: 'bg-amber-100 text-amber-800' },
    { id: 'note_added', label: 'Notes', icon: MessageSquare, color: 'bg-indigo-100 text-indigo-800' },
  ];

  // Date range options
  const dateRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
  ];

  // Toggle item expansion
  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Format full date
  const formatFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter activities
  const filteredActivities = displayActivities.filter(activity => {
    if (filters.type !== 'all' && activity.type !== filters.type) return false;
    if (filters.user !== 'all' && activity.user.name !== filters.user) return false;
    
    if (filters.dateRange !== 'all') {
      const activityDate = new Date(activity.timestamp);
      const now = new Date();
      let startDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      return activityDate >= startDate;
    }
    
    return true;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  // Activity item component
  const ActivityItem = ({ activity, isFirst, isLast }) => {
    const Icon = activity.icon;
    const isExpanded = expandedItems[activity.id];
    
    return (
      <div className="flex group">
        {/* Timeline line */}
        <div className="flex flex-col items-center mr-4">
          <div className={`w-3 h-3 rounded-full ${activity.color} border-2 border-white shadow-sm z-10`} />
          {!isLast && (
            <div className="flex-1 w-0.5 bg-gray-200 dark:bg-gray-700 mt-1" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 pb-6">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => toggleExpand(activity.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${activity.color.replace('500', '100')}`}>
                    <Icon size={18} className={activity.color.replace('500', '600')} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {formatTime(activity.timestamp)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <User size={12} className="mr-1" />
                        {activity.user.name}
                        <span className="ml-1 px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {activity.user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              
              {/* Expanded content */}
              {isExpanded && activity.metadata && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {JSON.stringify(activity.metadata, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="flex justify-end mt-3 space-x-2">
                    <button className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      View Details
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                      Take Action
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex">
              <div className="mr-4">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
              </div>
              <div className="flex-1">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Timeline</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all recruitment activities and changes
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'timeline' ? 'list' : 'timeline')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
          >
            {viewMode === 'timeline' ? 'List View' : 'Timeline View'}
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-3" size={20} />
            <h3 className="font-medium text-gray-900 dark:text-white">Filter Activities</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Activity Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activity Type
              </label>
              <div className="flex flex-wrap gap-2">
                {activityTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        const newFilters = { ...filters, type: type.id };
                        setFilters(newFilters);
                        onFilterChange(newFilters);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center ${
                        filters.type === type.id
                          ? type.color
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon size={14} className="mr-2" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => {
                  const newFilters = { ...filters, dateRange: e.target.value };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {dateRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredActivities.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 Days</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredActivities.filter(a => {
                      const date = new Date(a.timestamp);
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      return date > weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="relative">
          {/* Timeline */}
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, dateActivities]) => (
              <div key={date} className="relative">
                {/* Date Header */}
                <div className="sticky top-0 z-10 mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({dateActivities.length} activities)
                    </span>
                  </div>
                </div>

                {/* Activities for this date */}
                <div className="ml-8">
                  {dateActivities.map((activity, index) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      isFirst={index === 0}
                      isLast={index === dateActivities.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Activity</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">User</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Time</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Details</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredActivities.map(activity => {
                  const Icon = activity.icon;
                  return (
                    <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${activity.color.replace('500', '100')} mr-3`}>
                            <Icon size={16} className={activity.color.replace('500', '600')} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {activity.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {activity.user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user.role}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatFullDate(activity.timestamp)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(activity.timestamp)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleExpand(activity.id)}
                          className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {expandedItems[activity.id] ? 'Hide' : 'Show'} Details
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No activities found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or check back later for new activities
          </p>
        </div>
      )}

      {/* Activity Summary */}
      {filteredActivities.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredActivities.length} of {displayActivities.length} total activities
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Last updated: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatTime(new Date())}
                </span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTimelineUI;