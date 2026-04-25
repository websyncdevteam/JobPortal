import React, { useState, useEffect } from 'react';
import { Users, Search, Loader, Phone, Mail, FileText, Grid, List, Filter, Download, Plus, X, Send } from 'lucide-react';
import { useRecruiter } from '../../context/RecruiterContext';
import PipelineView from './candidates/PipelineView';
import AdvancedFilters from './AdvancedFilters';
import BulkActionsUI from './BulkActionsUI';
import QuickActionsToolbar from './QuickActionsToolbar';
import ActivityTimelineUI from './ActivityTimelineUI';
import api from '../../services/api';
import { toast } from 'sonner';

// Helper Icons
const CalendarIcon = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const BriefcaseIcon = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const MoreVerticalIcon = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="1"/>
    <circle cx="12" cy="5" r="1"/>
    <circle cx="12" cy="19" r="1"/>
  </svg>
);

const ChevronDownIcon = ({ className = '' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

// Candidate Card Component
const CandidateCard = ({ candidate, isSelected, onSelect, onPush, onSchedule, onUpdateStatus }) => {
  const [pushing, setPushing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduledTime: '',
    type: 'online',
    meetingLink: '',
    notes: ''
  });

  const handlePush = async () => {
    setPushing(true);
    try {
      await onPush(candidate._id);
    } catch (error) {
      console.error('Push error:', error);
    } finally {
      setPushing(false);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleData.scheduledTime) {
      toast.error("Please select date and time");
      return;
    }
    try {
      await onSchedule(candidate._id, scheduleData);
      setShowScheduleModal(false);
      setScheduleData({ scheduledTime: '', type: 'online', meetingLink: '', notes: '' });
    } catch (error) {
      console.error('Schedule error:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === candidate.status) return;
    try {
      await onUpdateStatus(candidate._id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'recruiter_screening', label: 'Screening' },
    { value: 'recruiter_interview', label: 'Interview' },
  ];

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm p-4 border ${isSelected ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-100'} hover:shadow-md transition-all duration-200`}>
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <input type="checkbox" checked={isSelected} onChange={(e) => { e.stopPropagation(); onSelect(candidate._id); }} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
            <div className="text-lg font-bold text-indigo-700">{candidate.name ? candidate.name.charAt(0).toUpperCase() : '?'}</div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-base">{candidate.name || 'Unnamed Candidate'}</h3>
                <p className="text-gray-500 text-sm mt-1 truncate">Applied for {candidate.jobTitle || 'Unknown Position'}</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <select
                  value={candidate.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-2 py-1 rounded-full text-xs font-medium border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center text-gray-500 text-sm gap-2">
              <span className="flex items-center"><CalendarIcon size={14} className="mr-1" />{candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : 'Recently'}</span>
              {candidate.experience && <span className="flex items-center"><BriefcaseIcon size={14} className="mr-1" />{candidate.experience}y exp</span>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${candidate.phone}`} className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors text-sm"><div className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50"><Phone size={14} /></div><span className="ml-1.5 hidden sm:inline">Call</span></a>
              <a href={`mailto:${candidate.email}`} className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors text-sm"><div className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50"><Mail size={14} /></div><span className="ml-1.5 hidden sm:inline">Email</span></a>
              {candidate.resumeUrl && (
                <a href={candidate.resumeUrl.startsWith('http') ? candidate.resumeUrl : `https://www.backendserver.aim9hire.com/api/uploads/${candidate.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors text-sm"><div className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50"><FileText size={14} /></div><span className="ml-1.5 hidden sm:inline">Resume</span></a>
              )}
              <button onClick={handlePush} disabled={pushing} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm"><div className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100">{pushing ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}</div><span className="ml-1.5 hidden sm:inline">Push</span></button>
              <button onClick={() => setShowScheduleModal(true)} className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors text-sm"><div className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100"><CalendarIcon size={14} /></div><span className="ml-1.5 hidden sm:inline">Schedule</span></button>
              <div className="flex-1"></div>
              <button className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"><div className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"><MoreVerticalIcon size={14} /></div></button>
            </div>
            <div className="mt-3 flex flex-col xs:flex-row gap-2">
              <button className="flex-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center justify-center"><CalendarIcon size={14} className="mr-2" /> Schedule</button>
              <button className="flex-1 text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 truncate">View Profile</button>
            </div>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-900">Schedule Interview</h3><button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700">Date & Time</label><input type="datetime-local" value={scheduleData.scheduledTime} onChange={(e) => setScheduleData({ ...scheduleData, scheduledTime: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700">Interview Type</label><select value={scheduleData.type} onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"><option value="online">Online (Video Call)</option><option value="offline">Offline (In-Person)</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700">Meeting Link (for online)</label><input type="url" placeholder="https://meet.google.com/..." value={scheduleData.meetingLink} onChange={(e) => setScheduleData({ ...scheduleData, meetingLink: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Additional Notes</label><textarea rows="3" value={scheduleData.notes} onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Any instructions for the candidate..." /></div>
              <div className="flex gap-3 pt-2"><button onClick={handleScheduleSubmit} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Schedule & Send Email</button><button onClick={() => setShowScheduleModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main CandidateManagement Component
const CandidateManagement = () => {
  const { jobs, candidates, loading, fetchCandidates } = useRecruiter();
  const [selectedJob, setSelectedJob] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [activityFilters, setActivityFilters] = useState({});
  const [pushLoading, setPushLoading] = useState(false);

  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJob) setSelectedJob(jobs[0]._id);
  }, [jobs]);

  useEffect(() => {
    if (selectedJob) fetchCandidates(selectedJob);
  }, [selectedJob]);

  const pushCandidateToCompany = async (applicationId) => {
    try {
      const res = await api.post("/recruiter/candidates/push", { applicationIds: [applicationId], notes: "Pushed by recruiter", interviewDate: null });
      toast.success(res.data.message || "Candidate pushed to company");
      if (selectedJob) fetchCandidates(selectedJob);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to push candidate");
      throw err;
    }
  };

  const pushSelectedToCompany = async () => {
    if (selectedCandidates.length === 0) { toast.error("No candidates selected"); return; }
    setPushLoading(true);
    try {
      const res = await api.post("/recruiter/candidates/push", { applicationIds: selectedCandidates, notes: "Bulk push by recruiter", interviewDate: null });
      toast.success(res.data.message || `${selectedCandidates.length} candidate(s) pushed to company`);
      setSelectedCandidates([]);
      if (selectedJob) fetchCandidates(selectedJob);
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk push failed");
    } finally {
      setPushLoading(false);
    }
  };

  const scheduleInterviewForCandidate = async (applicationId, scheduleData) => {
    try {
      await api.post("/recruiter/interviews/schedule", { applicationId, scheduledTime: scheduleData.scheduledTime, type: scheduleData.type, meetingLink: scheduleData.meetingLink, notes: scheduleData.notes });
      toast.success("Interview scheduled and email sent to candidate");
      if (selectedJob) fetchCandidates(selectedJob);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule interview");
      throw err;
    }
  };

  const updateCandidateStatusLocal = async (applicationId, newStatus) => {
    try {
      await api.put(`/recruiter/candidates/${applicationId}/status`, { status: newStatus });
      if (selectedJob) fetchCandidates(selectedJob);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      throw err;
    }
  };

  const filteredCandidates = candidates && candidates.length > 0
    ? candidates.filter((candidate) => {
        if (statusFilter !== 'all' && candidate.status !== statusFilter) return false;
        if (searchText && !candidate.name?.toLowerCase().includes(searchText.toLowerCase())) return false;
        if (advancedFilters.skills && advancedFilters.skills.length > 0) {
          const candidateSkills = candidate.skills || [];
          if (!advancedFilters.skills.some(skill => candidateSkills.includes(skill))) return false;
        }
        if (advancedFilters.experienceMin && (candidate.experience || 0) < advancedFilters.experienceMin) return false;
        if (advancedFilters.experienceMax && (candidate.experience || 0) > advancedFilters.experienceMax) return false;
        return true;
      })
    : [];

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev => prev.includes(candidateId) ? prev.filter(id => id !== candidateId) : [...prev, candidateId]);
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) setSelectedCandidates([]);
    else setSelectedCandidates(filteredCandidates.map(c => c._id));
  };

  const handleBulkAction = (action, items) => {
    if (action === 'push') pushSelectedToCompany();
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'filter') setShowAdvancedFilters(!showAdvancedFilters);
  };

  const selectedJobName = jobs?.find(job => job._id === selectedJob)?.title || '';

  // Compute stats once to avoid inline arrow functions in JSX (build fix)
  const totalCandidates = filteredCandidates.length;
  const newCount = filteredCandidates.filter(c => c.status === 'new').length;
  const reviewedCount = filteredCandidates.filter(c => c.status === 'reviewed').length;
  const interviewCount = filteredCandidates.filter(c => c.status === 'interview').length;
  const hiredCount = filteredCandidates.filter(c => c.status === 'hired').length;
  const rejectedCount = filteredCandidates.filter(c => c.status === 'rejected').length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">Candidate Management</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1 truncate">{selectedJobName ? `${selectedJobName}` : 'Select a job to view candidates'}</p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 md:gap-3">
          <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('cards')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><List size={14} className="mr-1.5" /> Cards</button>
            <button onClick={() => setViewMode('pipeline')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${viewMode === 'pipeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><Grid size={14} className="mr-1.5" /> Pipeline</button>
            <button onClick={() => setViewMode('timeline')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${viewMode === 'timeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><CalendarIcon size={14} className="mr-1.5" /> Timeline</button>
          </div>
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="md:hidden flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"><Filter size={18} /><span className="ml-2">Filters</span></button>
          <button className="flex items-center justify-center bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700"><Plus size={16} className="mr-1.5 md:mr-2" /><span className="hidden xs:inline">Add Candidate</span><span className="xs:hidden">Add</span></button>
        </div>
      </div>

      <div className="hidden lg:block"><QuickActionsToolbar onAction={handleQuickAction} currentView="candidates" /></div>

      {selectedCandidates.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm text-indigo-700">{selectedCandidates.length} candidate(s) selected</span>
          <button onClick={pushSelectedToCompany} disabled={pushLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center">
            {pushLoading ? <Loader size={16} className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />} Push to Company
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Select Job</h3>
              <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm">
                {jobs && jobs.length > 0 ? jobs.map(job => <option key={job._id} value={job._id}>{job.title} ({job.applicationCount || 0})</option>) : <option value="">No jobs available</option>}
              </select>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3"><h3 className="font-medium text-gray-900">Status Filter</h3><button onClick={() => setStatusFilter('all')} className="text-sm text-indigo-600">Clear</button></div>
              <div className="space-y-2">{['all', 'new', 'reviewed', 'interview', 'hired', 'rejected'].map(status => (<button key={status} onClick={() => setStatusFilter(status)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === status ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-700 hover:bg-gray-50'}`}><div className="flex items-center justify-between"><span>{status === 'all' ? 'All Statuses' : status === 'new' ? 'New Applicants' : status === 'reviewed' ? 'Reviewed' : status === 'interview' ? 'Interview Stage' : status === 'hired' ? 'Hired' : 'Rejected'}</span><span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{status === 'all' ? filteredCandidates.length : filteredCandidates.filter(c => c.status === status).length}</span></div></button>))}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Search Candidates</h3>
              <div className="relative"><input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by name, skills..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" /><Search size={16} className="absolute left-3 top-2.5 text-gray-400" /></div>
            </div>
            <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300"><div className="flex items-center"><Filter size={18} className="text-gray-400 mr-3" /><div className="text-left"><h3 className="font-medium text-gray-900">Advanced Filters</h3><p className="text-sm text-gray-500">Experience, skills, location</p></div></div><div className={`ml-2 w-6 h-6 rounded-full flex items-center justify-center ${showAdvancedFilters ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}><ChevronDownIcon className={showAdvancedFilters ? 'rotate-180' : ''} /></div></button>
            {showAdvancedFilters && <AdvancedFilters onFilterChange={setAdvancedFilters} initialFilters={advancedFilters} availableSkills={Array.from(new Set(candidates?.flatMap(c => c.skills || []).filter(Boolean)))} availableJobTypes={Array.from(new Set(jobs?.map(j => j.jobType).filter(Boolean)))} />}
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto">
              <div className="p-4 border-b flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Filters</h3><button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
              <div className="p-4 space-y-6">
                <div><h3 className="font-medium text-gray-900 mb-3">Select Job</h3><select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">{jobs && jobs.length > 0 ? jobs.map(job => <option key={job._id} value={job._id}>{job.title} ({job.applicationCount || 0})</option>) : <option>No jobs</option>}</select></div>
                <div><div className="flex items-center justify-between mb-3"><h3 className="font-medium text-gray-900">Status Filter</h3><button onClick={() => setStatusFilter('all')} className="text-sm text-indigo-600">Clear</button></div><div className="space-y-2">{['all', 'new', 'reviewed', 'interview', 'hired', 'rejected'].map(status => (<button key={status} onClick={() => setStatusFilter(status)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === status ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-700 hover:bg-gray-50'}`}><div className="flex items-center justify-between"><span>{status === 'all' ? 'All Statuses' : status === 'new' ? 'New' : status === 'reviewed' ? 'Reviewed' : status === 'interview' ? 'Interview' : status === 'hired' ? 'Hired' : 'Rejected'}</span><span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{status === 'all' ? filteredCandidates.length : filteredCandidates.filter(c => c.status === status).length}</span></div></button>))}</div></div>
                <div><h3 className="font-medium text-gray-900 mb-3">Search Candidates</h3><div className="relative"><input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by name, skills..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /><Search size={16} className="absolute left-3 top-2.5 text-gray-400" /></div></div>
                <button onClick={() => setShowMobileFilters(false)} className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Apply Filters</button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {selectedCandidates.length > 0 && (
            <div className="hidden lg:block mb-4">
              <BulkActionsUI items={filteredCandidates} selectedItems={selectedCandidates} onSelectAll={handleSelectAll} onSelectItem={handleSelectCandidate} onBulkAction={handleBulkAction} isLoading={loading.candidates} />
            </div>
          )}

          <div className="lg:hidden mb-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search candidates..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <button onClick={() => setShowMobileFilters(true)} className="p-2.5 bg-gray-100 rounded-lg"><Filter size={18} /></button>
            </div>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
              {['all', 'new', 'reviewed', 'interview', 'hired', 'rejected'].map(status => {
                let chipClass = '';
                if (statusFilter === status) {
                  if (status === 'new') chipClass = 'bg-blue-100 text-blue-800';
                  else if (status === 'reviewed') chipClass = 'bg-amber-100 text-amber-800';
                  else if (status === 'interview') chipClass = 'bg-purple-100 text-purple-800';
                  else if (status === 'hired') chipClass = 'bg-green-100 text-green-800';
                  else if (status === 'rejected') chipClass = 'bg-gray-100 text-gray-800';
                  else chipClass = 'bg-indigo-100 text-indigo-800';
                } else {
                  chipClass = 'bg-gray-100 text-gray-700';
                }
                let label = '';
                if (status === 'all') label = 'All';
                else if (status === 'new') label = 'New';
                else if (status === 'reviewed') label = 'Reviewed';
                else if (status === 'interview') label = 'Interview';
                else if (status === 'hired') label = 'Hired';
                else if (status === 'rejected') label = 'Rejected';
                return (
                  <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${chipClass}`}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {viewMode === 'pipeline' ? (
            <PipelineView />
          ) : viewMode === 'timeline' ? (
            <ActivityTimelineUI activities={[]} onFilterChange={setActivityFilters} onExport={() => console.log('Export')} />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-3 md:p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div><h3 className="font-medium text-gray-900 text-sm md:text-base">Candidates <span className="text-gray-500">({filteredCandidates.length})</span></h3><p className="text-xs md:text-sm text-gray-500 truncate">{selectedCandidates.length > 0 && `${selectedCandidates.length} selected • `}{selectedJobName ? `Job: ${selectedJobName}` : 'Select a job'}</p></div>
                <div className="flex items-center gap-2 self-end sm:self-center"><button className="px-2 md:px-3 py-1.5 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"><Download size={12} className="mr-1 md:mr-2" /><span className="hidden xs:inline">Export</span></button><select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="lg:hidden px-2 py-1.5 border border-gray-300 rounded-lg text-xs md:text-sm bg-white"><option value="cards">Cards View</option><option value="pipeline">Pipeline View</option><option value="timeline">Timeline View</option></select></div>
              </div>
              <div className="p-3 md:p-4">
                {loading.candidates ? (
                  <div className="flex flex-col items-center justify-center h-48 md:h-64"><Loader className="animate-spin text-indigo-600" size={32} /><span className="mt-3 text-gray-600">Loading candidates...</span></div>
                ) : filteredCandidates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
                    {filteredCandidates.map(candidate => (
                      <CandidateCard
                        key={candidate._id}
                        candidate={candidate}
                        isSelected={selectedCandidates.includes(candidate._id)}
                        onSelect={handleSelectCandidate}
                        onPush={pushCandidateToCompany}
                        onSchedule={scheduleInterviewForCandidate}
                        onUpdateStatus={updateCandidateStatusLocal}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <div className="bg-gray-100 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3"><Users size={24} className="text-gray-400" /></div>
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">No candidates found</h3>
                    <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">{searchText || statusFilter !== 'all' || Object.keys(advancedFilters).length > 0 ? "Try adjusting your search or filters" : jobs && jobs.length > 0 ? "This job doesn't have any applicants yet" : 'No jobs posted yet'}</p>
                    {(searchText || statusFilter !== 'all' || Object.keys(advancedFilters).length > 0) && <button className="mt-4 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => { setSearchText(''); setStatusFilter('all'); setAdvancedFilters({}); setShowMobileFilters(false); }}>Clear all filters</button>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredCandidates.length > 0 && viewMode === 'cards' && (
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            <div className="text-center"><div className="text-xl md:text-2xl font-bold text-gray-900">{totalCandidates}</div><div className="text-xs md:text-sm text-gray-500">Total</div></div>
            <div className="text-center"><div className="text-xl md:text-2xl font-bold text-blue-600">{newCount}</div><div className="text-xs md:text-sm text-gray-500">New</div></div>
            <div className="text-center"><div className="text-xl md:text-2xl font-bold text-amber-600">{reviewedCount}</div><div className="text-xs md:text-sm text-gray-500">Reviewed</div></div>
            <div className="text-center"><div className="text-xl md:text-2xl font-bold text-purple-600">{interviewCount}</div><div className="text-xs md:text-sm text-gray-500">Interview</div></div>
            <div className="text-center"><div className="text-xl md:text-2xl font-bold text-green-600">{hiredCount}</div><div className="text-xs md:text-sm text-gray-500">Hired</div></div>
            <div className="text-center"><div className="text-xl md:text-2xl font-bold text-gray-600">{rejectedCount}</div><div className="text-xs md:text-sm text-gray-500">Rejected</div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;
