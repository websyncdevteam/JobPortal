// frontend/src/components/recruiter/PipelineView.jsx
// VISUAL KANBAN BOARD - PURE UI/UX ENHANCEMENT
// Uses existing candidate data and status values, no backend modifications

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Filter, 
  Search, 
  MoreVertical, 
  Calendar, 
  Mail, 
  Phone,
  FileText,
  ChevronRight,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Settings,
  Download,
  Printer,
  Share2,
  Copy,
  AlertCircle,
  Star,
  Flag,
  Tag,
  Zap,
  UserCheck
} from 'lucide-react';
import { useRecruiter } from '../../../context/RecruiterContext';

const PipelineView = () => {
  const { 
    jobs, 
    candidates, 
    loading, 
    fetchCandidates,
    updateCandidateStatus 
  } = useRecruiter();
  
  const [selectedJob, setSelectedJob] = useState('');
  const [searchText, setSearchText] = useState('');
  const [localCandidates, setLocalCandidates] = useState([]);
  const [draggingCandidate, setDraggingCandidate] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    experience: [],
    skills: [],
    education: [],
    dateRange: 'all'
  });

  // Initialize with first job
  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]._id);
    }
  }, [jobs]);

  // Fetch candidates when job changes
  useEffect(() => {
    if (selectedJob) {
      fetchCandidates(selectedJob);
    }
  }, [selectedJob, fetchCandidates]);

  // Update local candidates when context candidates change
  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setLocalCandidates(candidates);
    }
  }, [candidates]);

  // Pipeline columns configuration
  const pipelineColumns = [
    { 
      id: 'new', 
      title: 'New Applicants', 
      icon: <Users size={16} />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      badgeColor: 'bg-blue-100 text-blue-800',
      limit: 999
    },
    { 
      id: 'reviewed', 
      title: 'Reviewed', 
      icon: <Eye size={16} />,
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
      badgeColor: 'bg-amber-100 text-amber-800',
      limit: 999
    },
    { 
      id: 'interview', 
      title: 'Interview', 
      icon: <Calendar size={16} />,
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      badgeColor: 'bg-purple-100 text-purple-800',
      limit: 10
    },
    { 
      id: 'hired', 
      title: 'Hired', 
      icon: <CheckCircle size={16} />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      badgeColor: 'bg-green-100 text-green-800',
      limit: 999
    },
    { 
      id: 'rejected', 
      title: 'Rejected', 
      icon: <XCircle size={16} />,
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-700',
      badgeColor: 'bg-gray-100 text-gray-800',
      limit: 999
    },
  ];

  // Filter candidates based on search and filters
  const filteredCandidates = localCandidates
    .filter(candidate => {
      // Search filter
      if (searchText && !candidate.name?.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      
      // Experience filter
      if (filters.experience.length > 0) {
        // Assuming candidate has experience field
        const candidateExp = candidate.experience || 0;
        if (!filters.experience.some(exp => candidateExp >= exp.min && candidateExp <= exp.max)) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt));

  // Group candidates by status
  const groupedCandidates = pipelineColumns.reduce((acc, column) => {
    acc[column.id] = filteredCandidates.filter(candidate => candidate.status === column.id);
    return acc;
  }, {});

  // Handle drag start
  const handleDragStart = (e, candidate, status) => {
    setDraggingCandidate({ ...candidate, originalStatus: status });
    e.dataTransfer.setData('text/plain', candidate._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggingCandidate || draggingCandidate.status === newStatus) {
      return;
    }

    try {
      // Update local state immediately for better UX
      setLocalCandidates(prev => 
        prev.map(candidate => 
          candidate._id === draggingCandidate._id 
            ? { ...candidate, status: newStatus } 
            : candidate
        )
      );

      // Call the existing update function
      await updateCandidateStatus(draggingCandidate._id, newStatus, `Status changed from ${draggingCandidate.status} to ${newStatus}`);
      
      console.log(`✅ Moved candidate to ${newStatus}`);
    } catch (error) {
      // Revert on error
      setLocalCandidates(prev => 
        prev.map(candidate => 
          candidate._id === draggingCandidate._id 
            ? { ...candidate, status: draggingCandidate.status } 
            : candidate
        )
      );
      console.error('Failed to update candidate status:', error);
    } finally {
      setDraggingCandidate(null);
    }
  };

  // Candidate Card Component
  const CandidateCard = ({ candidate }) => {
    const getInitials = (name) => {
      return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'new': return 'bg-blue-500';
        case 'reviewed': return 'bg-amber-500';
        case 'interview': return 'bg-purple-500';
        case 'hired': return 'bg-green-500';
        case 'rejected': return 'bg-gray-500';
        default: return 'bg-gray-500';
      }
    };

    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-move mb-3 group"
        draggable="true"
        onDragStart={(e) => handleDragStart(e, candidate, candidate.status)}
      >
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${getStatusColor(candidate.status)} flex items-center justify-center text-white font-semibold text-sm`}>
                  {getInitials(candidate.name)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center">
                  {candidate.status === 'new' && <Users size={8} className="text-blue-600" />}
                  {candidate.status === 'reviewed' && <Eye size={8} className="text-amber-600" />}
                  {candidate.status === 'interview' && <Calendar size={8} className="text-purple-600" />}
                  {candidate.status === 'hired' && <CheckCircle size={8} className="text-green-600" />}
                  {candidate.status === 'rejected' && <XCircle size={8} className="text-gray-600" />}
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm text-gray-900 truncate">{candidate.name}</h4>
                <p className="text-xs text-gray-500 truncate">
                  {candidate.jobTitle || 'Applied Position'}
                </p>
                {candidate.experience && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {candidate.experience} years exp
                  </p>
                )}
              </div>
            </div>
            
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
              <MoreVertical size={14} className="text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <button 
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${candidate.email}`;
                }}
              >
                <Mail size={10} className="inline mr-1" />
                Email
              </button>
              <button className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                <FileText size={10} className="inline mr-1" />
                Resume
              </button>
            </div>
            
            <span className="text-xs text-gray-400">
              {candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'New'}
            </span>
          </div>
          
          {candidate.notes && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 truncate">
                <MessageSquare size={10} className="inline mr-1" />
                {candidate.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Pipeline Column Component
  const PipelineColumn = ({ column }) => {
    const columnCandidates = groupedCandidates[column.id] || [];
    const isOverLimit = column.limit && columnCandidates.length > column.limit;
    
    return (
      <div 
        className={`rounded-lg border ${column.color} h-full min-h-[600px] flex flex-col`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, column.id)}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-md ${column.badgeColor} mr-3`}>
              {column.icon}
            </div>
            <div>
              <h3 className={`font-semibold ${column.textColor}`}>{column.title}</h3>
              <p className="text-xs text-gray-500">
                {columnCandidates.length} candidate{columnCandidates.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${column.badgeColor}`}>
            {columnCandidates.length}
          </div>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto">
          {columnCandidates.length > 0 ? (
            <>
              {columnCandidates.slice(0, column.limit).map(candidate => (
                <CandidateCard key={candidate._id} candidate={candidate} />
              ))}
              
              {isOverLimit && (
                <div className="text-center py-3">
                  <div className="text-xs text-gray-500 bg-gray-100 rounded-lg py-2">
                    +{columnCandidates.length - column.limit} more candidates
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${column.color.replace('50', '100')} mb-3`}>
                {column.icon}
              </div>
              <p className="text-sm text-gray-500">No candidates in this stage</p>
              <p className="text-xs text-gray-400 mt-1">Drag candidates here</p>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t">
          <button 
            className="w-full text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 py-2 rounded-lg transition-colors flex items-center justify-center"
            onClick={() => {
              // This would trigger the existing "Add Candidate" flow
              console.log('Add candidate to', column.title);
            }}
          >
            <span className="mr-2">+</span>
            Add Candidate
          </button>
        </div>
      </div>
    );
  };

  // Quick Actions Component
  const QuickActionsToolbar = () => (
    <div className="flex items-center space-x-2 mb-4">
      <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
        <Filter size={14} className="mr-2" />
        Filter
      </button>
      <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
        <Download size={14} className="mr-2" />
        Export
      </button>
      <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
        <Printer size={14} className="mr-2" />
        Print
      </button>
      <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
        <Share2 size={14} className="mr-2" />
        Share Board
      </button>
      <div className="flex-1"></div>
      <div className="flex items-center space-x-1">
        <button 
          className={`px-3 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setViewMode('list')}
        >
          List View
        </button>
        <button 
          className={`px-3 py-2 rounded-lg transition-colors ${viewMode === 'pipeline' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setViewMode('pipeline')}
        >
          Pipeline View
        </button>
      </div>
    </div>
  );

  // Loading State
  if (loading.candidates || loading.general) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader className="animate-spin text-indigo-600" size={40} />
        <p className="mt-4 text-gray-600">Loading pipeline data...</p>
        <p className="text-sm text-gray-400">Preparing your visual candidate pipeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Pipeline</h1>
          <p className="text-gray-600 mt-1">
            Visualize and manage candidates through your hiring process
          </p>
        </div>
        
        {/* Job Selector */}
        <div className="flex items-center space-x-4">
          <div className="min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} ({job.applicationCount || 0} applicants)
                  </option>
                ))
              ) : (
                <option value="">No jobs available</option>
              )}
            </select>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search candidates..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Quick Actions Toolbar */}
      <QuickActionsToolbar />

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {pipelineColumns.map(column => {
          const count = groupedCandidates[column.id]?.length || 0;
          const percentage = filteredCandidates.length > 0 
            ? Math.round((count / filteredCandidates.length) * 100) 
            : 0;
          
          return (
            <div key={column.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{column.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                </div>
                <div className={`p-2 rounded-full ${column.color}`}>
                  {column.icon}
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${column.badgeColor.replace('100', '500').replace('text', 'bg')}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{percentage}% of total</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag & Drop Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Zap size={20} className="text-blue-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-blue-800">Drag & Drop Interface</p>
            <p className="text-sm text-blue-600">
              Drag candidates between columns to update their status. All changes are saved automatically.
            </p>
          </div>
        </div>
        <button className="text-sm text-blue-700 hover:text-blue-900 font-medium">
          View Tutorial →
        </button>
      </div>

      {/* Main Pipeline View */}
      {viewMode === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {pipelineColumns.map(column => (
            <PipelineColumn key={column.id} column={column} />
          ))}
        </div>
      ) : (
        // List View (Fallback)
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {filteredCandidates.map(candidate => (
                <CandidateCard key={candidate._id} candidate={candidate} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Help Text */}
      <div className="text-center py-4 border-t">
        <p className="text-sm text-gray-500">
          <strong>Tip:</strong> Use drag & drop to move candidates between stages. 
          Click on any candidate to view details or take action.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Showing {filteredCandidates.length} of {localCandidates.length} total candidates
        </p>
      </div>
    </div>
  );
};

export default PipelineView;