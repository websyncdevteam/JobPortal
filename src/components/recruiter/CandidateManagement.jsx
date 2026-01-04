import React, { useState, useEffect } from 'react';
import { Users, Search, Loader, Phone, Mail, FileText } from 'lucide-react';
import { useRecruiter } from '../../context/RecruiterContext';

const CandidateCard = ({ candidate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-start">
        <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed flex-shrink-0" />

        <div className="ml-4 flex-1 min-w-0">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg truncate">{candidate.name}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                candidate.status === 'new'
                  ? 'bg-blue-100 text-blue-800'
                  : candidate.status === 'reviewed'
                  ? 'bg-amber-100 text-amber-800'
                  : candidate.status === 'hired'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {candidate.status === 'new'
                ? 'New'
                : candidate.status === 'reviewed'
                ? 'Reviewed'
                : candidate.status === 'hired'
                ? 'Hired'
                : 'Rejected'}
            </span>
          </div>

          <p className="text-gray-500 text-sm mt-1">Applied for {candidate.jobTitle}</p>
          <p className="text-gray-500 text-sm">
            Applied on {new Date(candidate.appliedDate).toLocaleDateString()}
          </p>

          <div className="mt-3 flex items-center space-x-4">
            <a
              href={`tel:${candidate.phone}`}
              className="flex items-center text-gray-500 hover:text-indigo-600"
            >
              <Phone size={16} className="mr-1" /> Call
            </a>
            <a
              href={`mailto:${candidate.email}`}
              className="flex items-center text-gray-500 hover:text-indigo-600"
            >
              <Mail size={16} className="mr-1" /> Email
            </a>
            <button className="flex items-center text-gray-500 hover:text-indigo-600">
              <FileText size={16} className="mr-1" /> Resume
            </button>
          </div>

          <div className="mt-4 flex space-x-2">
            <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
              Schedule Interview
            </button>
            <button className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateManagement = () => {
  const { jobs, candidates, loading, fetchCandidates } = useRecruiter();
  const [selectedJob, setSelectedJob] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Set first job as default selected
  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]._id);
    }
  }, [jobs]);

  // Fetch candidates when selected job changes
  useEffect(() => {
    if (selectedJob) {
      fetchCandidates(selectedJob);
    }
  }, [selectedJob]);

  const filteredCandidates =
    candidates && candidates.length > 0
      ? candidates
          .filter((candidate) => {
            if (statusFilter === 'all') return true;
            return candidate.status === statusFilter;
          })
          .filter((candidate) =>
            candidate.name.toLowerCase().includes(searchText.toLowerCase())
          )
      : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Candidate Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          {/* Job Select */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))
              ) : (
                <option value="">No jobs available</option>
              )}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Applicants</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview Stage</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard key={candidate._id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No candidates found</h3>
            <p className="text-gray-500">
              {jobs && jobs.length > 0
                ? "This job doesn't have any applicants yet"
                : 'No jobs posted yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateManagement;
