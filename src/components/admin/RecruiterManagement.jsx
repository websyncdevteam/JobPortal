import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'; 
import { 
  Users, Building, Mail, Search, Filter, RefreshCw, Eye, 
  XCircle, CheckCircle, AlertTriangle, Briefcase, UserCheck,
  DollarSign, MoreVertical, BadgeCheck, Clock, Activity,
  Download, Settings, BarChart3, TrendingUp,
  Calendar, Shield, MailCheck, UserPlus, Target,
  ChevronDown, ChevronUp, FileText, PieChart,
  CheckSquare, Square, Trash2, Send, Edit, Download as DownloadIcon,
  BarChart2, Award, Star, Globe
} from 'lucide-react';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';

const RecruiterManagement = () => {
  const { user: currentUser } = useAuth();
  const [recruiters, setRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // NEW STATES FOR ENHANCED FEATURES
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false); // Start with analytics hidden
  const [showActivityFeed, setShowActivityFeed] = useState(false); // Start with activity feed hidden
  const [activities, setActivities] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    verification: 'all',
    company: 'all',
    performance: 'all',
    dateRange: 'all'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recruiters
      const recruitersResponse = await api.get('/admin/recruiters');
      
      // Fetch companies
      const companiesResponse = await api.get('/admin/companies');

      console.log('Recruiters response:', recruitersResponse.data);
      console.log('Companies response:', companiesResponse.data);

      // Check what format the data is actually coming in
      let recruitersData = [];
      let companiesData = [];

      // For recruiters
      if (recruitersResponse.data?.data?.recruiters) {
        recruitersData = recruitersResponse.data.data.recruiters;
      } else if (recruitersResponse.data?.recruiters) {
        recruitersData = recruitersResponse.data.recruiters;
      } else if (Array.isArray(recruitersResponse.data)) {
        recruitersData = recruitersResponse.data;
      } else if (recruitersResponse.data?.data) {
        recruitersData = recruitersResponse.data.data;
      }

      // For companies
      if (Array.isArray(companiesResponse.data)) {
        companiesData = companiesResponse.data;
      } else if (companiesResponse.data?.data) {
        companiesData = companiesResponse.data.data;
      } else if (companiesResponse.data?.companies) {
        companiesData = companiesResponse.data.companies;
      }

      console.log('Processed recruiters:', recruitersData);
      console.log('Processed companies:', companiesData);

      setRecruiters(Array.isArray(recruitersData) ? recruitersData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);

    } catch (err) {
      console.error('API Error details:', err.response?.data || err.message);
      setError({ type: 'error', message: err.response?.data?.message || 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  // Generate mock activities from recruiter data
  const generateMockActivities = (recruitersData) => {
    const activities = [];
    const activityTypes = ['job_posted', 'profile_updated', 'company_assigned', 'login'];
    const descriptions = [
      'posted a new job',
      'updated their profile',
      'was assigned to a company',
      'logged into the system',
      'made a placement',
      'onboarded a freelancer'
    ];

    recruitersData.slice(0, 5).forEach(recruiter => {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const daysAgo = Math.floor(Math.random() * 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      activities.push({
        _id: `activity_${recruiter._id}_${Date.now()}`,
        type,
        description: `${recruiter.fullname || recruiter.name} ${description}`,
        createdAt: date.toISOString()
      });
    });

    return activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Calculate performance metrics based on actual data
  const calculateMetrics = (recruiter) => {
    const jobs = recruiter.jobs || recruiter.jobsCount || 0;
    const placements = recruiter.placements || recruiter.placementsCount || 0;
    const freelancers = recruiter.freelancers || recruiter.freelancersCount || 0;
    const candidates = recruiter.candidates || recruiter.candidatesCount || 0;
    
    const revenue = placements * 5000; // Example calculation
    const successRate = candidates > 0 ? Math.round((placements / candidates) * 100) : 0;

    return {
      jobsPosted: jobs,
      placementsMade: placements,
      freelancersOnboarded: freelancers,
      candidatesReferred: candidates,
      revenueGenerated: revenue,
      successRate: successRate,
      responseRate: recruiter.responseRate || 85,
      avgTimeToHire: recruiter.avgTimeToHire || 14
    };
  };

  // Calculate performance score
  const calculatePerformanceScore = (recruiter) => {
    const metrics = calculateMetrics(recruiter);
    let score = 0;
    
    if (metrics.jobsPosted > 0) score += Math.min(metrics.jobsPosted, 20);
    if (metrics.placementsMade > 0) score += Math.min(metrics.placementsMade * 5, 40);
    if (metrics.freelancersOnboarded > 0) score += Math.min(metrics.freelancersOnboarded * 3, 20);
    if (metrics.successRate > 80) score += 20;
    else if (metrics.successRate > 60) score += 15;
    else if (metrics.successRate > 40) score += 10;
    
    return Math.min(score, 100);
  };

  // Filter recruiters based on search
  const filteredRecruiters = useMemo(() => {
    let result = [...recruiters];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(recruiter => (
        recruiter.fullname?.toLowerCase().includes(searchLower) ||
        recruiter.name?.toLowerCase().includes(searchLower) ||
        recruiter.email?.toLowerCase().includes(searchLower) ||
        recruiter.company?.companyName?.toLowerCase().includes(searchLower) ||
        recruiter.company?.name?.toLowerCase().includes(searchLower)
      ));
    }

    // Status filter
    if (filters.status === 'active') {
      result = result.filter(r => !r.isSuspended);
    } else if (filters.status === 'suspended') {
      result = result.filter(r => r.isSuspended);
    }

    // Verification filter
    if (filters.verification === 'verified') {
      result = result.filter(r => r.recruiterProfile?.isVerified);
    } else if (filters.verification === 'not-verified') {
      result = result.filter(r => !r.recruiterProfile?.isVerified);
    }

    // Company filter
    if (filters.company !== 'all') {
      result = result.filter(r => 
        (r.company?._id === filters.company) || 
        (r.company === filters.company)
      );
    }

    // Performance filter
    if (filters.performance !== 'all') {
      result = result.filter(recruiter => {
        const score = calculatePerformanceScore(recruiter);
        if (filters.performance === 'high') return score >= 80;
        if (filters.performance === 'medium') return score >= 50 && score < 80;
        if (filters.performance === 'low') return score < 50;
        return true;
      });
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter(recruiter => {
        const created = new Date(recruiter.createdAt);
        const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        
        switch(filters.dateRange) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          case 'quarter': return diffDays <= 90;
          default: return true;
        }
      });
    }

    return result;
  }, [recruiters, searchTerm, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = recruiters.length;
    const active = recruiters.filter(r => !r.isSuspended).length;
    const verified = recruiters.filter(r => r.recruiterProfile?.isVerified).length;
    const newThisWeek = recruiters.filter(r => {
      const created = new Date(r.createdAt);
      const now = new Date();
      return Math.floor((now - created) / (1000 * 60 * 60 * 24)) <= 7;
    }).length;
    
    const totalJobs = recruiters.reduce((sum, r) => sum + calculateMetrics(r).jobsPosted, 0);
    const totalPlacements = recruiters.reduce((sum, r) => sum + calculateMetrics(r).placementsMade, 0);
    const totalRevenue = recruiters.reduce((sum, r) => sum + calculateMetrics(r).revenueGenerated, 0);
    
    // Calculate averages
    const avgScore = recruiters.length > 0 
      ? Math.round(recruiters.reduce((sum, r) => sum + calculatePerformanceScore(r), 0) / recruiters.length)
      : 0;

    return {
      total,
      active,
      verified,
      newThisWeek,
      totalJobs,
      totalPlacements,
      totalRevenue,
      avgScore
    };
  }, [recruiters]);

  // Chart data preparation (simple version without Recharts)
  const chartData = useMemo(() => {
    // Performance distribution
    const performanceDistribution = [
      { name: 'High (80-100)', value: recruiters.filter(r => calculatePerformanceScore(r) >= 80).length, color: '#10B981' },
      { name: 'Medium (50-79)', value: recruiters.filter(r => calculatePerformanceScore(r) >= 50 && calculatePerformanceScore(r) < 80).length, color: '#F59E0B' },
      { name: 'Low (0-49)', value: recruiters.filter(r => calculatePerformanceScore(r) < 50).length, color: '#EF4444' }
    ];

    // Monthly growth
    const monthlyData = recruiters.reduce((acc, recruiter) => {
      const month = new Date(recruiter.createdAt).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, count: 0, revenue: 0 };
      }
      acc[month].count += 1;
      acc[month].revenue += calculateMetrics(recruiter).revenueGenerated;
      return acc;
    }, {});

    const monthlyChartData = Object.values(monthlyData).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    // Company distribution
    const companyDistribution = companies.map(company => ({
      name: company.name,
      recruiters: recruiters.filter(r => r.company?._id === company._id || r.company === company._id).length
    })).filter(c => c.recruiters > 0);

    return {
      performanceDistribution,
      monthlyChartData,
      companyDistribution
    };
  }, [recruiters, companies]);

  // Export functionality
  const exportToCSV = async () => {
    try {
      setExportLoading(true);
      const headers = ['Name', 'Email', 'Company', 'Status', 'Verified', 'Jobs Posted', 'Placements', 'Success Rate', 'Revenue', 'Performance Score', 'Last Login'];
      const rows = recruiters.map(recruiter => {
        const metrics = calculateMetrics(recruiter);
        return [
          recruiter.fullname || recruiter.name,
          recruiter.email,
          recruiter.company?.name || 'N/A',
          recruiter.isSuspended ? 'Suspended' : 'Active',
          recruiter.recruiterProfile?.isVerified ? 'Yes' : 'No',
          metrics.jobsPosted,
          metrics.placementsMade,
          `${metrics.successRate}%`,
          `$${formatNumber(metrics.revenueGenerated)}`,
          `${calculatePerformanceScore(recruiter)}%`,
          formatDate(recruiter.lastLogin)
        ];
      });

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recruiters-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      // Show success notification
      setError({ type: 'success', message: 'Export completed successfully!' });
    } catch (err) {
      setError({ type: 'error', message: 'Failed to export data' });
    } finally {
      setExportLoading(false);
    }
  };

  // Bulk operations
  const handleSelectRecruiter = (recruiterId, checked) => {
    if (checked) {
      setSelectedRecruiters(prev => [...prev, recruiterId]);
    } else {
      setSelectedRecruiters(prev => prev.filter(id => id !== recruiterId));
    }
  };

  const handleSelectAll = () => {
    if (selectedRecruiters.length === filteredRecruiters.length) {
      setSelectedRecruiters([]);
    } else {
      setSelectedRecruiters(filteredRecruiters.map(r => r._id));
    }
  };

  // FIXED: bulkAssignCompany function - uses single assignment endpoint
  const bulkAssignCompany = async (companyId) => {
    try {
      // Use the single assignment endpoint for each recruiter
      await Promise.all(
        selectedRecruiters.map(recruiterId => 
          api.post('/admin/recruiters/assign-company', {
            recruiterId: recruiterId,
            companyId: companyId,
            position: 'Recruiter',
            department: 'HR'
          })
        )
      );
      
      setShowAssignmentModal(false);
      setSelectedRecruiters([]);
      fetchData();
      setError({ type: 'success', message: `Company assigned to ${selectedRecruiters.length} recruiter(s)` });
    } catch (err) {
      console.error('Assign company error:', err.response?.data || err.message);
      setError({ type: 'error', message: err.response?.data?.message || 'Failed to assign company' });
    }
  };

  const bulkSuspend = async () => {
    try {
      await Promise.all(
        selectedRecruiters.map(id => 
          api.put(`/admin/user/suspend/${id}`)
        )
      );
      setSelectedRecruiters([]);
      fetchData();
      setError({ type: 'success', message: `Suspended ${selectedRecruiters.length} recruiter(s)` });
    } catch (err) {
      setError({ type: 'error', message: 'Failed to suspend recruiters' });
    }
  };

  const bulkVerify = async () => {
    try {
      await Promise.all(
        selectedRecruiters.map(id => 
          api.put(`/admin/recruiters/${id}/verify`)
        )
      );
      setSelectedRecruiters([]);
      fetchData();
      setError({ type: 'success', message: `Verified ${selectedRecruiters.length} recruiter(s)` });
    } catch (err) {
      setError({ type: 'error', message: 'Failed to verify recruiters' });
    }
  };

  // Format helpers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Color utilities
  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading recruiters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header with enhanced controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Recruiter Management</h1>
            <p className="text-gray-600">Manage, monitor, and analyze recruiter performance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              disabled={exportLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {exportLoading ? (
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <DownloadIcon size={16} className="mr-2" />
              )}
              Export CSV
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <BarChart3 size={16} className="mr-2" />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total Recruiters</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-xs text-blue-600">+{stats.newThisWeek} this week</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Active</p>
                <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                <p className="text-xs text-green-600">{Math.round((stats.active / stats.total) * 100) || 0}% of total</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Avg Score</p>
                <p className="text-2xl font-bold text-purple-900">{stats.avgScore}%</p>
                <p className="text-xs text-purple-600">Overall performance</p>
              </div>
              <Award className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Revenue</p>
                <p className="text-2xl font-bold text-orange-900">Rs{formatNumber(stats.totalRevenue)}</p>
                <p className="text-xs text-orange-600">From placements</p>
              </div>
              <DollarSign className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-700">Verified</p>
                <p className="text-2xl font-bold text-cyan-900">{stats.verified}</p>
                <p className="text-xs text-cyan-600">{Math.round((stats.verified / stats.total) * 100) || 0}% verified</p>
              </div>
              <BadgeCheck className="text-cyan-600" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-700">Placements</p>
                <p className="text-2xl font-bold text-pink-900">{stats.totalPlacements}</p>
                <p className="text-xs text-pink-600">Successful hires</p>
              </div>
              <UserCheck className="text-pink-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedRecruiters.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="text-blue-600" size={20} />
              <span className="font-medium text-blue-900">
                {selectedRecruiters.length} recruiters selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAssignmentModal(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Assign Company
              </button>
              <button
                onClick={bulkVerify}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Verify
              </button>
              <button
                onClick={bulkSuspend}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Suspend
              </button>
              <button
                onClick={() => setSelectedRecruiters([])}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Analytics (no Recharts needed) */}
      {showAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <PieChart size={18} className="mr-2 text-purple-600" />
              Performance Distribution
            </h3>
            <div className="space-y-3">
              {chartData.performanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 mr-2">{item.value}</span>
                    <span className="text-xs text-gray-500">
                      ({recruiters.length > 0 ? Math.round((item.value / recruiters.length) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp size={18} className="mr-2 text-green-600" />
              Monthly Growth
            </h3>
            <div className="space-y-2">
              {chartData.monthlyChartData.slice(-6).map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm text-gray-600 w-12">{item.month}</span>
                  <div className="flex-1 ml-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{item.count} recruiters</span>
                      <span>${formatNumber(item.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${Math.min((item.count / Math.max(...chartData.monthlyChartData.map(d => d.count))) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Building size={18} className="mr-2 text-blue-600" />
              Company Distribution
            </h3>
            <div className="space-y-3">
              {chartData.companyDistribution.slice(0, 5).map((company, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate max-w-[150px]">{company.name}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full bg-purple-500"
                        style={{ width: `${Math.min((company.recruiters / Math.max(...chartData.companyDistribution.map(c => c.recruiters))) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{company.recruiters}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search recruiters by name, email, or company..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} className="mr-2" />
            Filters
            {showFilters ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.verification}
                  onChange={(e) => setFilters({...filters, verification: e.target.value})}
                >
                  <option value="all">All</option>
                  <option value="verified">Verified Only</option>
                  <option value="not-verified">Not Verified</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Performance</label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.performance}
                  onChange={(e) => setFilters({...filters, performance: e.target.value})}
                >
                  <option value="all">All Levels</option>
                  <option value="high">High (80%+)</option>
                  <option value="medium">Medium (50-79%)</option>
                  <option value="low">Low (0-49%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.company}
                  onChange={(e) => setFilters({...filters, company: e.target.value})}
                >
                  <option value="all">All Companies</option>
                  {companies.map(company => (
                    <option key={company._id} value={company._id}>{company.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFilters({
                  status: 'all',
                  verification: 'all',
                  company: 'all',
                  performance: 'all',
                  dateRange: 'all'
                })}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Activity Feed */}
      {showActivityFeed && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Activity size={18} className="mr-2 text-blue-600" />
              Recent Activities
            </h3>
            <button
              onClick={() => setShowActivityFeed(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Hide
            </button>
          </div>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'job_posted' ? 'bg-green-500' : 
                    activity.type === 'profile_updated' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          )}
        </div>
      )}

      {/* Recruiters Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Recruiters ({filteredRecruiters.length})
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedRecruiters.length === filteredRecruiters.length && filteredRecruiters.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecruiters.map((recruiter) => {
            const metrics = calculateMetrics(recruiter);
            const performanceScore = calculatePerformanceScore(recruiter);

            return (
              <div key={recruiter._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                {/* Header with checkbox */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedRecruiters.includes(recruiter._id)}
                        onChange={(e) => handleSelectRecruiter(recruiter._id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold shadow">
                        {(recruiter.fullname || recruiter.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {recruiter.fullname || recruiter.name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate max-w-[180px]">{recruiter.email}</p>
                      </div>
                    </div>
                    <QuickActionsMenu 
                      recruiter={recruiter}
                      onAssignCompany={() => {
                        setSelectedRecruiter(recruiter);
                        setShowAssignmentModal(true);
                      }}
                      onVerify={async () => {
                        try {
                          await api.put(`/admin/recruiters/${recruiter._id}/verify`);
                          fetchData();
                          setError({ type: 'success', message: 'Recruiter verified successfully' });
                        } catch (err) {
                          setError({ type: 'error', message: 'Failed to verify recruiter' });
                        }
                      }}
                      onSuspend={async () => {
                        try {
                          await api.put(`/admin/user/suspend/${recruiter._id}`);
                          fetchData();
                          setError({ type: 'success', message: recruiter.isSuspended ? 'Recruiter activated' : 'Recruiter suspended' });
                        } catch (err) {
                          setError({ type: 'error', message: 'Failed to update recruiter status' });
                        }
                      }}
                      onSendEmail={() => {/* Email logic */}}
                    />
                  </div>
                </div>

                {/* Company Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {recruiter.company ? (
                        <>
                          <Building size={16} className="text-green-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {recruiter.company.companyName || recruiter.company.name}
                          </span>
                          {recruiter.associatedCompanies && recruiter.associatedCompanies.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              +{recruiter.associatedCompanies.length}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">No Company</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {recruiter.recruiterProfile?.isVerified && (
                        <BadgeCheck size={16} className="text-blue-500" />
                      )}
                      <div className={`w-2 h-2 rounded-full ${recruiter.isSuspended ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    </div>
                  </div>
                </div>

                {/* Performance Score */}
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Performance</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(performanceScore)}`}>
                        {performanceScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          performanceScore >= 80 ? 'bg-green-500' :
                          performanceScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${performanceScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-900">{metrics.jobsPosted}</div>
                      <div className="text-xs text-blue-700">Jobs</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-900">{metrics.placementsMade}</div>
                      <div className="text-xs text-green-700">Placements</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-900">{metrics.freelancersOnboarded}</div>
                      <div className="text-xs text-purple-700">Freelancers</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-900">${formatNumber(metrics.revenueGenerated)}</div>
                      <div className="text-xs text-orange-700">Revenue</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600 flex items-center">
                      <Clock size={12} className="mr-1" />
                      Last active: {formatDate(recruiter.lastLogin)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRecruiter(recruiter);
                          setShowDetailsModal(true);
                        }}
                        className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition"
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredRecruiters.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm || Object.values(filters).some(f => f !== 'all') ? 'No recruiters found' : 'No recruiters available'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Recruiters will appear here once added'}
          </p>
          {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  status: 'all',
                  verification: 'all',
                  company: 'all',
                  performance: 'all',
                  dateRange: 'all'
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showDetailsModal && selectedRecruiter && (
        <DetailsModal
          recruiter={selectedRecruiter}
          onClose={() => setShowDetailsModal(false)}
          formatNumber={formatNumber}
          formatDate={formatDate}
          calculateMetrics={calculateMetrics}
          calculatePerformanceScore={calculatePerformanceScore}
        />
      )}

      {showAssignmentModal && (
        <BulkAssignmentModal
          companies={companies}
          onAssign={bulkAssignCompany}
          onClose={() => setShowAssignmentModal(false)}
          isSingle={!selectedRecruiters.length}
          selectedRecruiter={selectedRecruiters.length ? null : selectedRecruiter}
        />
      )}

      {/* Error/Success Alert */}
      {error && (
        <div className={`fixed top-4 right-4 ${error.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} rounded-lg p-4 shadow-lg max-w-md z-50`}>
          <div className="flex items-start">
            {error.type === 'success' ? (
              <CheckCircle className="text-green-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
            ) : (
              <AlertTriangle className="text-red-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
            )}
            <div className="flex-1">
              <p className={`font-medium ${error.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {error.type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className={`text-sm ${error.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {error.message}
              </p>
            </div>
            <button 
              onClick={() => setError(null)}
              className={`ml-4 ${error.type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Quick Actions Menu Component
const QuickActionsMenu = ({ recruiter, onAssignCompany, onVerify, onSuspend, onSendEmail }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
      >
        <MoreVertical size={16} className="text-gray-500" />
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <button 
              onClick={() => {
                onAssignCompany();
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Building size={14} className="mr-2" />
              Assign Company
            </button>
            <button 
              onClick={() => {
                onVerify();
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <BadgeCheck size={14} className="mr-2" />
              {recruiter.recruiterProfile?.isVerified ? 'Unverify' : 'Verify'}
            </button>
            <button 
              onClick={() => {
                onSuspend();
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Shield size={14} className="mr-2" />
              {recruiter.isSuspended ? 'Activate' : 'Suspend'}
            </button>
            <button 
              onClick={() => {
                onSendEmail();
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Send size={14} className="mr-2" />
              Send Email
            </button>
            <button 
              onClick={() => setShowMenu(false)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
            >
              <XCircle size={14} className="mr-2" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Bulk Assignment Modal Component
const BulkAssignmentModal = ({ companies, onAssign, onClose, isSingle, selectedRecruiter }) => {
  const [selectedCompany, setSelectedCompany] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {isSingle ? 'Assign Company' : `Assign Company to ${selectedRecruiter ? 'Recruiter' : 'Multiple Recruiters'}`}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <XCircle size={24} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Company
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a company</option>
              {companies.map(company => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCompany && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                {isSingle ? 'This recruiter will be assigned to the selected company' : 'All selected recruiters will be assigned to the selected company'}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (selectedCompany) {
                  onAssign(selectedCompany);
                }
              }}
              disabled={!selectedCompany}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Company
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Details Modal Component
const DetailsModal = ({ recruiter, onClose, formatNumber, formatDate, calculateMetrics, calculatePerformanceScore }) => {
  const metrics = calculateMetrics(recruiter);
  const performanceScore = calculatePerformanceScore(recruiter);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Recruiter Details</h3>
              <p className="text-gray-600">Complete profile and performance overview</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <XCircle size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Header with Profile */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {(recruiter.fullname || recruiter.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {recruiter.fullname || recruiter.name || 'Unknown'}
                  </h4>
                  <p className="text-gray-600">{recruiter.email}</p>
                  <p className="text-gray-500">{recruiter.recruiterProfile?.position || 'Recruiter'}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {recruiter.company && (
                    <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <Building size={12} className="inline mr-1" />
                      {recruiter.company.companyName || recruiter.company.name}
                    </span>
                  )}
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    recruiter.isSuspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {recruiter.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                  {recruiter.recruiterProfile?.isVerified && (
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      <BadgeCheck size={12} className="inline mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Score */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="text-lg font-bold text-gray-900">Performance Score</h5>
                <p className="text-gray-600">Overall performance rating</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-lg font-bold ${
                performanceScore >= 80 ? 'bg-green-100 text-green-800' :
                performanceScore >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {performanceScore}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  performanceScore >= 80 ? 'bg-green-500' :
                  performanceScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${performanceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-900">{metrics.jobsPosted}</div>
              <div className="text-sm text-blue-700 font-medium">Jobs Posted</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-900">{metrics.placementsMade}</div>
              <div className="text-sm text-green-700 font-medium">Placements</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-2xl font-bold text-purple-900">{metrics.freelancersOnboarded}</div>
              <div className="text-sm text-purple-700 font-medium">Freelancers</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-900">${formatNumber(metrics.revenueGenerated)}</div>
              <div className="text-sm text-orange-700 font-medium">Revenue</div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Details */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                <Activity size={16} className="mr-2 text-blue-600" />
                Performance Details
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold">{metrics.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Candidates Referred</span>
                  <span className="font-semibold">{metrics.candidatesReferred}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-semibold">{metrics.responseRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Time to Hire</span>
                  <span className="font-semibold">{metrics.avgTimeToHire} days</span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                <UserCheck size={16} className="mr-2 text-green-600" />
                Account Information
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined Date</span>
                  <span className="font-semibold">{formatDate(recruiter.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-semibold">{formatDate(recruiter.lastLogin)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Login Count</span>
                  <span className="font-semibold">{recruiter.loginCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className={`font-semibold ${
                    recruiter.isSuspended ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {recruiter.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter Profile Details */}
          {recruiter.recruiterProfile && (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h5 className="font-bold text-gray-900 mb-4">Recruiter Profile</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-medium">{recruiter.recruiterProfile.position || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{recruiter.recruiterProfile.department || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-medium">{recruiter.recruiterProfile.employeeId || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hire Date</p>
                  <p className="font-medium">{formatDate(recruiter.recruiterProfile.hireDate)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Associated Companies */}
          {recruiter.associatedCompanies && recruiter.associatedCompanies.length > 0 && (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h5 className="font-bold text-gray-900 mb-4">Associated Companies</h5>
              <div className="space-y-2">
                {recruiter.associatedCompanies.map((assoc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building size={14} className="text-gray-500" />
                      <span className="font-medium">Company {index + 1}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {assoc.role}
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${assoc.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Close Details
            </button>
            <button
              onClick={() => {
                // Navigate to edit page or open edit modal
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterManagement;