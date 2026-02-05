import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/services/api'; // normal axios instance
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import {
  validateEmail,
  validatePhoneNumber,
  sanitizeInput,
  validateFileSize,
  validateFileType,
} from '@/utils/validation';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user, token } = useSelector((store) => store.auth); // grab token from Redux
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: '',
    resume: null,
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form state when dialog opens
  useEffect(() => {
    if (open && user) {
      setInput({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: user?.profile?.skills?.join(', ') || '',
        resume: null,
        profilePhoto: null,
      });
      setErrors({});
      setTouched({});
    }
  }, [open, user]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!input.fullname.trim()) newErrors.fullname = 'Full name is required';
    else if (input.fullname.trim().length < 2) newErrors.fullname = 'Full name must be at least 2 characters';
    else if (input.fullname.trim().length > 50) newErrors.fullname = 'Full name cannot exceed 50 characters';

    if (!input.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(input.email)) newErrors.email = 'Please enter a valid email address';

    if (input.phoneNumber && !validatePhoneNumber(input.phoneNumber.toString()))
      newErrors.phoneNumber = 'Please enter a valid phone number';

    if (input.bio.length > 500) newErrors.bio = 'Bio cannot exceed 500 characters';

    if (input.skills) {
      const skillsArray = input.skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsArray.length > 20) newErrors.skills = 'Cannot have more than 20 skills';
    }

    if (input.profilePhoto) {
      if (!validateFileType(input.profilePhoto, ALLOWED_IMAGE_TYPES))
        newErrors.profilePhoto = 'Only JPEG, PNG, GIF, and WebP images are allowed';
      if (!validateFileSize(input.profilePhoto, MAX_FILE_SIZE))
        newErrors.profilePhoto = 'Profile photo must be less than 5MB';
    }

    if (input.resume) {
      if (!validateFileType(input.resume, ALLOWED_RESUME_TYPES))
        newErrors.resume = 'Only PDF, DOC, and DOCX files are allowed';
      if (!validateFileSize(input.resume, MAX_FILE_SIZE))
        newErrors.resume = 'Resume must be less than 5MB';
    }

    return newErrors;
  }, [input]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setInput(prev => ({ ...prev, [name]: sanitizedValue }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleFileChange = useCallback((e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInput(prev => ({ ...prev, [fieldName]: file }));
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: '' }));
  }, [errors]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setTouched(Object.keys(input).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = new FormData();
    if (input.fullname !== user?.fullname) formData.append('fullname', input.fullname.trim());
    if (input.email !== user?.email) formData.append('email', input.email.trim());
    if (input.phoneNumber !== user?.phoneNumber) formData.append('phoneNumber', input.phoneNumber.trim());
    if (input.bio !== user?.profile?.bio) formData.append('bio', input.bio.trim());
    if (input.skills !== (user?.profile?.skills?.join(', ') || '')) formData.append('skills', input.skills.trim());
    if (input.resume) formData.append('resume', input.resume);
    if (input.profilePhoto) formData.append('profilePhoto', input.profilePhoto);

    if ([...formData].length === 0) {
      toast.info('No changes detected');
      return;
    }

    try {
      setLoading(true);
      const res = await api.patch('/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // use Redux token
        },
      });

      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || 'Profile updated successfully');
        setOpen(false);
      } else {
        throw new Error(res.data?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      let message = 'Failed to update profile. Please try again.';
      if (err.response?.status === 401) message = 'Session expired. Please login again.';
      else if (err.response?.status === 413) message = 'File too large (max 5MB).';
      else if (!err.response) message = 'Network error. Check your connection.';
      else if (err.response?.data?.message) message = err.response.data.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
        <AlertCircle size={14} />
        <span>{errors[field]}</span>
      </div>
    ) : null;

  const renderSuccess = (field) =>
    touched[field] && !errors[field] && input[field] ? (
      <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
        <CheckCircle size={14} />
        <span>Looks good!</span>
      </div>
    ) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>Update your profile information. All fields are validated.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} noValidate>
          {/* Render all fields: fullname, email, phone, bio, skills, profilePhoto, resume */}
          {/* ...same JSX as before... */}
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Profile...
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" className="my-4" disabled={loading}>
                  Update Profile
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

UpdateProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default UpdateProfileDialog;
