import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Loader2, Trash, ArrowLeft, Building } from 'lucide-react';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth || {});
  const { companies = [] } = useSelector((store) => store.company || {});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [jobCompany, setJobCompany] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId || !user) {
        navigate('/admin/jobs');
        return;
      }

      try {
        // Use environment variable for API base URL
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com';
        const res = await axios.get(`${API_BASE_URL}/api/v1/jobs/${jobId}`);
        
        if (res.data.success && res.data.data) {
          const job = res.data.data;
          setJobData(job);
          
          // Store company info from job
          if (job.company) {
            setJobCompany(job.company);
          }

          reset({
            title: job.title || '',
            description: job.description || '',
            location: job.location || '',
            salary: job.salary || '',
            experience: job.experience || '',
            skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || ''),
            company: job.company?._id || job.company || '',
          });
        } else {
          toast.error("Job not found");
          navigate('/admin/jobs');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load job');
        navigate('/admin/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, user, navigate, reset]);

  // Submit updated job
  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error('Admin privileges required');
      return;
    }

    setUpdating(true);

    try {
      const updatedData = {
        ...data,
        skills: data.skills.split(',').map((s) => s.trim()).filter(s => s.length > 0),
      };

      const api = axios.create({
        baseURL: ADMIN_API_END_POINT,
        withCredentials: true,
      });

      const res = await api.put(`/jobs/${jobId}`, updatedData);

      if (res.data.success) {
        toast.success(res.data.message || 'Job updated successfully');
        navigate('/admin/jobs');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update job');
    } finally {
      setUpdating(false);
    }
  };

  // Delete job
  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error('Admin privileges required');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const api = axios.create({
        baseURL: ADMIN_API_END_POINT,
        withCredentials: true,
      });

      const res = await api.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        toast.success(res.data.message || 'Job deleted successfully');
        dispatch({ type: "REMOVE_JOB", payload: jobId });
        navigate('/admin/jobs');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with company info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Job</h1>
            {jobCompany && (
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{jobCompany.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Title *</Label>
            <Input {...register('title', { required: true })} />
            {errors.title && <p className="text-red-600 text-sm">Title is required</p>}
          </div>
          
          <div>
            <Label>Company *</Label>
            {jobCompany ? (
              <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
                <Building className="h-4 w-4" />
                <span>{jobCompany.name}</span>
                <input type="hidden" {...register('company', { required: true })} value={jobCompany._id} />
              </div>
            ) : companies.length > 0 ? (
              <select
                {...register('company', { required: true })}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <Input 
                  {...register('company', { required: true })} 
                  placeholder="Enter company ID"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter company ID manually (from database)
                </p>
              </div>
            )}
            {errors.company && <p className="text-red-600 text-sm">Company is required</p>}
          </div>
          
          <div>
            <Label>Location *</Label>
            <Input {...register('location', { required: true })} />
            {errors.location && <p className="text-red-600 text-sm">Location is required</p>}
          </div>
          
          <div>
            <Label>Salary *</Label>
            <Input {...register('salary', { required: true })} />
            {errors.salary && <p className="text-red-600 text-sm">Salary is required</p>}
          </div>
          
          <div>
            <Label>Experience *</Label>
            <Input {...register('experience', { required: true })} />
            {errors.experience && <p className="text-red-600 text-sm">Experience is required</p>}
          </div>
          
          <div>
            <Label>Skills (comma separated) *</Label>
            <Input
              {...register('skills', { required: true })}
              placeholder="e.g. JavaScript, React, Node.js"
            />
            {errors.skills && <p className="text-red-600 text-sm">Skills are required</p>}
          </div>
        </div>

        <div>
          <Label>Description *</Label>
          <Textarea
            {...register('description', { required: true })}
            rows={6}
            className="min-h-[150px]"
          />
          {errors.description && <p className="text-red-600 text-sm">Description is required</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={updating} className="flex-1 bg-blue-600">
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Update Job'
            )}
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="h-4 w-4 mr-2" />
                Delete Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
