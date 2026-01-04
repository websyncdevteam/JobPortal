import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { jobService } from '../services/jobService.js';
import { setSavedJobs } from '../redux/jobSlice.js';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const SavedJobs = () => {
  const [loading, setLoading] = useState(true);
  const [savedJobsData, setSavedJobsData] = useState([]);
  const [error, setError] = useState(null);
  const savedJobIds = useSelector((state) => state.job.savedJobs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 SavedJobs component mounted');
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Fetching saved jobs...');
      
      const response = await jobService.getSavedJobs();
      console.log('📦 API Response:', response);
      
      if (response.success && response.data) {
        console.log(`✅ Found ${response.data.length} saved jobs`);
        setSavedJobsData(response.data);
        
        // Extract job IDs for Redux
        const jobIds = response.data
          .map(job => job._id || job._id?._id)
          .filter(Boolean);
        console.log('📋 Extracted Job IDs:', jobIds);
        
        dispatch(setSavedJobs(jobIds));
      } else {
        console.warn('⚠️ API returned success: false', response);
        setError(response.message || 'Failed to load saved jobs');
        toast.error(response.message || 'Failed to load saved jobs');
      }
    } catch (error) {
      console.error('❌ Error fetching saved jobs:', error);
      
      // Handle specific error types
      let errorMessage = 'Failed to load saved jobs';
      if (error.response?.status === 401) {
        errorMessage = 'Please login to view saved jobs';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      console.log('🗑️ Removing saved job:', jobId);
      const response = await jobService.saveJob(jobId);
      
      if (response.success) {
        const message = response.saved 
          ? 'Job saved successfully!' 
          : 'Job removed from saved list';
        toast.success(message);
        
        // Update local state immediately
        if (!response.saved) {
          setSavedJobsData(prev => prev.filter(job => 
            (job._id || job._id?._id) !== jobId
          ));
        }
        
        // Refresh the list
        await fetchSavedJobs();
      }
    } catch (error) {
      console.error('❌ Error removing saved job:', error);
      toast.error(error.response?.data?.message || 'Failed to update saved job');
    }
  };

  const handleViewJob = (jobId) => {
    console.log('👁️ Viewing job:', jobId);
    navigate(`/description/${jobId}`);
  };

  const handleBrowseJobs = () => {
    navigate('/jobs');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Saved Jobs</h1>
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <span className="text-gray-600">Loading your saved jobs...</span>
            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Saved Jobs</h1>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Saved Jobs</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-gray-500 mb-6">
              Please try again or contact support if the problem persists.
            </p>
            <button
              onClick={fetchSavedJobs}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors mr-4"
            >
              Try Again
            </button>
            <button
              onClick={handleBrowseJobs}
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (savedJobsData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Saved Jobs</h1>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No saved jobs yet</h2>
            <p className="text-gray-500 mb-6">
              Save jobs you're interested in by clicking the "Save Job" button on job listings.
            </p>
            <button
              onClick={handleBrowseJobs}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Browse Available Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Saved Jobs</h1>
            <p className="text-gray-600 mt-2">
              {savedJobsData.length} saved {savedJobsData.length === 1 ? 'job' : 'jobs'}
            </p>
          </div>
          <button
            onClick={fetchSavedJobs}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Clock size={16} />
            Refresh List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobsData.map((job, index) => {
            const jobId = job._id || job._id?._id;
            const jobTitle = job.title || 'Untitled Position';
            const companyName = job.company?.name || 'Unknown Company';
            const companyLogo = job.company?.logo;
            const location = job.location || 'Location not specified';
            const jobType = job.jobType || 'Full-time';
            const salary = job.salary || 'Salary not disclosed';
            const description = job.description || 'No description available';
            const experience = job.experienceLevel || 'Not specified';
            const skills = job.skills || [];

            return (
              <div key={jobId || index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {companyLogo ? (
                      <img 
                        src={companyLogo} 
                        alt={companyName}
                        className="h-12 w-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{jobTitle}</h3>
                      <p className="text-gray-600">{companyName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSavedJob(jobId)}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="space-y-3 mb-4 flex-grow">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span className="line-clamp-1">{location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={16} />
                    <span>{jobType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign size={16} />
                    <span>{salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm font-medium">Experience:</span>
                    <span>{experience}</span>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skills.slice(0, 3).map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-6 line-clamp-3 text-sm">
                  {description}
                </p>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleViewJob(jobId)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Found {savedJobsData.length} saved {savedJobsData.length === 1 ? 'job' : 'jobs'}
          </p>
          <button
            onClick={handleBrowseJobs}
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Browse More Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;