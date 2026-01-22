// frontend/src/components/recruiter/JobManagement.jsx - FIXED VERSION

import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash, Loader, Briefcase, Building, Filter } from "lucide-react";
import { useRecruiter } from "../../context/RecruiterContext";
import JobForm from "./JobForm";

const JobCard = ({ job, onEdit, onDelete, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'suspended': return 'Suspended';
      case 'closed': return 'Closed';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate flex-1 mr-2">{job.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
            {getStatusText(job.status)}
          </span>
        </div>
        
        {/* Company Info */}
        {job.company && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Building size={14} className="mr-1" />
            <span className="truncate">{job.company.name}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{job.location}</span>
          {job.isRemote && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
              Remote
            </span>
          )}
        </div>
        
        {job.salary && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <DollarSign size={14} className="mr-1" />
            <span>{job.salary}</span>
          </div>
        )}
        
        {/* Job Type and Experience */}
        <div className="flex flex-wrap gap-1 mt-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
            {job.jobType?.replace('-', ' ') || 'Full-time'}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full capitalize">
            {job.experienceLevel || 'Mid-level'}
          </span>
          {job.urgent && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Urgent
            </span>
          )}
          {job.featured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Featured
            </span>
          )}
        </div>
        
        {/* Posted Date */}
        <div className="mt-2 text-xs text-gray-400">
          Posted: {formatDate(job.createdAt)}
        </div>
      </div>
      
      <div className="p-4 flex justify-between items-center bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <span className="font-medium text-sm block">{job.applicationCount || 0}</span>
            <span className="text-gray-500 text-xs">Applicants</span>
          </div>
          <div className="text-center">
            <span className="font-medium text-sm block">{job.views || 0}</span>
            <span className="text-gray-500 text-xs">Views</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {/* Status Toggle */}
          <select
            value={job.status}
            onChange={(e) => onStatusUpdate(job._id, e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            <option value="active">Active</option>
            <option value="closed">Close</option>
            <option value="draft">Draft</option>
          </select>
          
          <button
            className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
            onClick={() => onEdit(job)}
            title="Edit job"
          >
            <Pencil size={16} />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            onClick={() => onDelete(job._id)}
            title="Delete job"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add missing icon components
const MapPin = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const DollarSign = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const JobManagement = () => {
  const { 
    jobs, 
    loading, 
    error,
    fetchRecruiterJobs, // 🔥 FIXED: Use fetchRecruiterJobs instead of fetchRecruiterData
    deleteJob, 
    updateJobStatus,
    clearError,
    stats,
    hasJobs
  } = useRecruiter();
  
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // 🔥 FIXED: Use fetchRecruiterJobs instead of fetchRecruiterData
  useEffect(() => {
    fetchRecruiterJobs();
  }, [fetchRecruiterJobs]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter((job) => {
      const matchesFilter = filter === "all" ? true : job.status === filter;
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.company?.name && job.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "applicants":
          return (b.applicationCount || 0) - (a.applicationCount || 0);
        default:
          return 0;
      }
    });

  const handleEdit = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      await deleteJob(jobId);
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    await updateJobStatus(jobId, newStatus);
  };

  const handleRefresh = () => {
    fetchRecruiterJobs();
  };

  if (loading.jobs && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-600" size={40} />
        <span className="ml-3 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your job postings and track applications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading.jobs}
          >
            <Loader className={`mr-2 ${loading.jobs ? 'animate-spin' : ''}`} size={16} />
            Refresh
          </button>
          <button
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            onClick={() => {
              setEditingJob(null);
              setShowForm(true);
            }}
          >
            <Plus size={18} className="mr-2" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <Briefcase className="text-blue-600 mr-3" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <Users className="text-purple-600 mr-3" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <Clock className="text-orange-600 mr-3" size={20} />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search jobs by title, location, or company..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
          
          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="applicants">Most Applicants</option>
            </select>
          </div>

          {/* Status Filters */}
          <div className="flex space-x-2">
            <button
              className={`px-3 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-2 rounded-lg transition-colors ${
                filter === "active"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`px-3 py-2 rounded-lg transition-colors ${
                filter === "closed"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              onClick={() => setFilter("closed")}
            >
              Closed
            </button>
            <button
              className={`px-3 py-2 rounded-lg transition-colors ${
                filter === "draft"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              onClick={() => setFilter("draft")}
            >
              Draft
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm || filter !== "all" ? "No jobs found" : "No jobs posted yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Post your first job to start receiving applications"}
            </p>
            {!searchTerm && filter === "all" && (
              <button
                className="flex items-center mx-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} className="mr-2" />
                Post Your First Job
              </button>
            )}
          </div>
        )}

        {/* Loading State for existing jobs */}
        {loading.jobs && jobs.length > 0 && (
          <div className="flex justify-center items-center py-4">
            <Loader className="animate-spin text-indigo-600 mr-2" size={20} />
            <span className="text-gray-600">Updating jobs...</span>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {showForm && (
        <JobForm
          job={editingJob}
          onClose={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
};

// Add missing Users icon
const Users = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// Add missing Clock icon
const Clock = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default JobManagement; 