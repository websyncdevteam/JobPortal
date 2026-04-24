// src/components/admin/EditJob.jsx - FIXED: Convert IDs to strings for comparison
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Loader2, Trash, ArrowLeft, Building } from 'lucide-react';
import api from '../../services/api';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth || {});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [jobCompany, setJobCompany] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId || !user) {
        navigate(isAdmin ? '/admin/jobs' : '/recruiter/jobs');
        return;
      }

      try {
        const res = await api.get(`/jobs/${jobId}`);
        
        if (res.data.success && res.data.data) {
          const job = res.data.data;
          
          // ✅ Convert both IDs to strings for reliable comparison
          const canEdit = isAdmin || (user._id?.toString() === job.postedBy?._id?.toString());
          setIsAuthorized(canEdit);

          if (!canEdit) {
            toast.error('You are not authorized to edit this job');
            navigate(isAdmin ? '/admin/jobs' : '/recruiter/jobs');
            return;
          }

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
          navigate(isAdmin ? '/admin/jobs' : '/recruiter/jobs');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load job');
        navigate(isAdmin ? '/admin/jobs' : '/recruiter/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, user, navigate, reset, isAdmin]);

  const onSubmit = async (data) => {
    if (!isAuthorized) {
      toast.error('You are not authorized to update this job');
      return;
    }

    setUpdating(true);

    try {
      const updatedData = {
        ...data,
        skills: data.skills.split(',').map((s) => s.trim()).filter(s => s.length > 0),
      };

      const endpoint = isAdmin ? `/admin/jobs/${jobId}` : `/recruiter/jobs/${jobId}`;
      const res = await api.put(endpoint, updatedData);

      if (res.data.success) {
        toast.success(res.data.message || 'Job updated successfully');
        navigate(isAdmin ? '/admin/jobs' : '/recruiter/jobs');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update job');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthorized) {
      toast.error('You are not authorized to delete this job');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const endpoint = isAdmin ? `/admin/jobs/${jobId}` : `/recruiter/jobs/${jobId}`;
      const res = await api.delete(endpoint);
      if (res.data.success) {
        toast.success(res.data.message || 'Job deleted successfully');
        dispatch({ type: "REMOVE_JOB", payload: jobId });
        navigate(isAdmin ? '/admin/jobs' : '/recruiter/jobs');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete job');
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

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to edit this job.</p>
          <button onClick={() => navigate(isAdmin ? '/admin/jobs' : '/recruiter/jobs')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to={isAdmin ? "/admin/jobs" : "/recruiter/jobs"}>
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
            <Label>Company</Label>
            {jobCompany ? (
              <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
                <Building className="h-4 w-4" />
                <span>{jobCompany.name}</span>
              </div>
            ) : (
              <Input disabled placeholder="Company not available" />
            )}
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
