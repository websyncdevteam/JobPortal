import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { jobService } from "../services/jobService.js";
import { addToSavedJobs, removeFromSavedJobs } from "../redux/jobSlice.js";
import { Bookmark, BookmarkCheck } from "lucide-react";

const JobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const savedJobs = useSelector((state) => state.job.savedJobs);

  // Check if current job is already saved
  useEffect(() => {
    if (id && savedJobs.length > 0) {
      const saved = savedJobs.includes(id);
      setIsSaved(saved);
    }
  }, [id, savedJobs]);

  // Check if already applied
  useEffect(() => {
    const checkAppliedStatus = async () => {
      if (id) {
        try {
          const applied = await jobService.checkIfApplied(id);
          setHasApplied(applied);
        } catch (error) {
          console.error("Failed to check application status:", error);
        }
      }
    };
    
    checkAppliedStatus();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job:", error);
      
      if (error.response?.status === 404) {
        toast.error("Job not found or no longer available");
        navigate("/browse");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch job details");
        navigate("/browse");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      // ✅ USE jobService instead of direct axios
      await jobService.applyToJob(id);
      
      // Update applied status
      setHasApplied(true);
      
    } catch (error) {
      console.error("Apply error:", error);
      // Error is already handled in jobService
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!id) return;
    
    setSaving(true);
    try {
      const response = await jobService.saveJob(id);
      
      if (response.success) {
        // Update Redux state
        if (response.saved) {
          dispatch(addToSavedJobs(id));
          setIsSaved(true);
        } else {
          dispatch(removeFromSavedJobs(id));
          setIsSaved(false);
        }
      }
    } catch (error) {
      console.error("Save job failed:", error);
      // Error is already handled in jobService
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJob();
      // Also check initial saved status
      jobService.checkIfJobIsSaved(id).then(saved => {
        setIsSaved(saved);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading job details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold">
        Job not found or no longer available
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <img
              src={`/api/v1/company/logo/${job.company?._id}`}
              alt={`${job.company?.name} logo`}
              className="w-12 h-12 object-contain border rounded"
              onError={(e) => (e.currentTarget.src = "/default-logo.png")}
            />
            <p className="text-gray-600">
              {job.company?.name || "Unknown Company"}
            </p>
          </div>
        </div>
        
        {/* Save Button with better UI */}
        <button
          onClick={handleSaveJob}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isSaved 
              ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
          } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>Processing...</span>
            </>
          ) : isSaved ? (
            <>
              <BookmarkCheck size={18} className="fill-current" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark size={18} />
              <span>Save Job</span>
            </>
          )}
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-1">Description</h2>
        <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Location</h2>
          <p className="text-gray-600">{job.location}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Salary</h2>
          <p className="text-gray-600">{job.salary || "Not disclosed"}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Job Type</h2>
          <p className="text-gray-600">{job.jobType || "N/A"}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Posted On</h2>
          <p className="text-gray-600">
            {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4 pt-6 border-t">
        <button
          onClick={handleApply}
          disabled={applying || hasApplied}
          className={`flex-1 ${
            hasApplied 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700'
          } text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50`}
        >
          {applying ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Applying...
            </span>
          ) : hasApplied ? 'Already Applied' : 'Apply Now'}
        </button>
        
        <button
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors"
        >
          ← Back to Jobs
        </button>
      </div>
    </div>
  );
};

export default JobDescription;