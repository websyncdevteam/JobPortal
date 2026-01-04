import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

const CompanyActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    type: 'all'
  });
  const [pagination, setPagination] = useState({});

  const activityIcons = {
    job_posted: '💼',
    application_submitted: '📄',
    profile_updated: '✏️',
    status_changed: '🔄',
    logo_updated: '🖼️',
    email_updated: '📧',
    password_reset: '🔒'
  };

  const activityColors = {
    job_posted: 'bg-blue-100 text-blue-800 border-blue-200',
    application_submitted: 'bg-green-100 text-green-800 border-green-200',
    profile_updated: 'bg-purple-100 text-purple-800 border-purple-200',
    status_changed: 'bg-orange-100 text-orange-800 border-orange-200',
    logo_updated: 'bg-pink-100 text-pink-800 border-pink-200',
    email_updated: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    password_reset: 'bg-red-100 text-red-800 border-red-200'
  };

  const fetchCompanyAndActivities = async () => {
    setLoading(true);
    try {
      // Fetch company details
      const companyResponse = await fetch(`/api/v1/company/admin/companies/${id}`);
      const companyData = await companyResponse.json();
      
      if (companyData.success) {
        setCompany(companyData.company);
      }

      // Fetch activities with filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const activityResponse = await fetch(
        `/api/v1/company/admin/companies/${id}/activity?${queryParams}`
      );
      const activityData = await activityResponse.json();
      
      console.log('Activity API Response:', activityData);

      if (activityData.success) {
        setActivities(activityData.activity);
        setPagination({
          page: activityData.page,
          totalPages: activityData.totalPages,
          total: activityData.total
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompanyAndActivities();
    }
  }, [id, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityDescription = (activity) => {
    if (activity.message) return activity.message;
    
    const baseMessages = {
      job_posted: 'New job posted',
      application_submitted: 'New application received',
      profile_updated: 'Company profile updated',
      status_changed: 'Company status changed',
      logo_updated: 'Company logo updated',
      email_updated: 'Company email updated',
      password_reset: 'Password reset'
    };
    
    return baseMessages[activity.type] || 'Activity recorded';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4 p-4 border rounded-lg">
              <div className="rounded-full bg-gray-200 h-8 w-8"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/companies')}
          className="mb-4"
        >
          ← Back to Companies
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Activity for {company?.name || 'Unknown Company'}</h1>
            <p className="text-gray-600">Tracking all company activities and changes</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select 
              value={filters.type} 
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="job_posted">Jobs Posted</SelectItem>
                <SelectItem value="application_submitted">Applications</SelectItem>
                <SelectItem value="profile_updated">Profile Updates</SelectItem>
                <SelectItem value="status_changed">Status Changes</SelectItem>
                <SelectItem value="email_updated">Email Updates</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.limit.toString()} 
              onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{pagination.total || 0}</div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {activities.filter(a => a.type === 'job_posted').length}
          </div>
          <div className="text-sm text-gray-600">Jobs Posted</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {activities.filter(a => a.type === 'application_submitted').length}
          </div>
          <div className="text-sm text-gray-600">Applications</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {activities.filter(a => a.type === 'status_changed').length}
          </div>
          <div className="text-sm text-gray-600">Status Changes</div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        
        <div className="p-6">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Activities Found</h3>
              <p className="text-gray-500">This company doesn't have any recorded activities yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div 
                  key={activity._id || index} 
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl flex-shrink-0">
                    {activityIcons[activity.type] || '📋'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900">
                        {getActivityDescription(activity)}
                      </p>
                      <Badge className={activityColors[activity.type] || 'bg-gray-100'}>
                        {activity.type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(activity.createdAt)}
                    </p>

                    {/* Additional Activity Data */}
                    {activity.data && Object.keys(activity.data).length > 0 && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                        {activity.data.oldEmail && activity.data.newEmail && (
                          <p>Email changed from <strong>{activity.data.oldEmail}</strong> to <strong>{activity.data.newEmail}</strong></p>
                        )}
                        {activity.data.jobsSuspended !== undefined && (
                          <p>{activity.data.jobsSuspended} jobs were affected</p>
                        )}
                        {activity.data.jobsActivated !== undefined && (
                          <p>{activity.data.jobsActivated} jobs were activated</p>
                        )}
                      </div>
                    )}

                    {activity.performedBy && (
                      <p className="text-xs text-gray-400 mt-1">
                        Performed by: {activity.performedBy.fullname || 'System'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                disabled={filters.page <= 1}
                onClick={() => handleFilterChange('page', filters.page - 1)}
              >
                Previous
              </Button>
              
              <div className="text-sm text-gray-600">
                Page {filters.page} of {pagination.totalPages} 
                <span className="mx-2">•</span>
                {pagination.total} total activities
              </div>
              
              <Button
                variant="outline"
                disabled={filters.page >= pagination.totalPages}
                onClick={() => handleFilterChange('page', filters.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyActivity;