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
import api from '@/services/api';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import {
  validateEmail,
  validatePhoneNumber,
  sanitizeInput,
  validateFileSize,
  validateFileType,
} from '@/utils/validation';

// Constants for validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // Initialize form state with user data
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: '',
    resume: null,
    profilePhoto: null,
  });

  // Reset form when dialog opens or user changes
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

  // Validation function
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Fullname validation
    if (!input.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    } else if (input.fullname.trim().length < 2) {
      newErrors.fullname = 'Full name must be at least 2 characters';
    } else if (input.fullname.trim().length > 50) {
      newErrors.fullname = 'Full name cannot exceed 50 characters';
    }

    // Email validation
    if (!input.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(input.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation
    if (input.phoneNumber && !validatePhoneNumber(input.phoneNumber.toString())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Bio validation
    if (input.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    // Skills validation
    if (input.skills) {
      const skillsArray = input.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      if (skillsArray.length > 20) {
        newErrors.skills = 'Cannot have more than 20 skills';
      }
    }

    // Profile photo validation
    if (input.profilePhoto) {
      if (!validateFileType(input.profilePhoto, ALLOWED_IMAGE_TYPES)) {
        newErrors.profilePhoto = 'Only JPEG, PNG, GIF, and WebP images are allowed';
      }
      if (!validateFileSize(input.profilePhoto, MAX_FILE_SIZE)) {
        newErrors.profilePhoto = 'Profile photo must be less than 5MB';
      }
    }

    // Resume validation
    if (input.resume) {
      if (!validateFileType(input.resume, ALLOWED_RESUME_TYPES)) {
        newErrors.resume = 'Only PDF, DOC, and DOCX files are allowed';
      }
      if (!validateFileSize(input.resume, MAX_FILE_SIZE)) {
        newErrors.resume = 'Resume must be less than 5MB';
      }
    }

    return newErrors;
  }, [input]);

  // Handle input change with sanitization
  const changeEventHandler = useCallback((e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setInput(prev => ({ ...prev, [name]: sanitizedValue }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle file input changes
  const resumeChangeHandler = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput(prev => ({ ...prev, resume: file }));
      setTouched(prev => ({ ...prev, resume: true }));
      
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: '' }));
      }
    }
  }, [errors]);

  const profilePhotoChangeHandler = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput(prev => ({ ...prev, profilePhoto: file }));
      setTouched(prev => ({ ...prev, profilePhoto: true }));
      
      if (errors.profilePhoto) {
        setErrors(prev => ({ ...prev, profilePhoto: '' }));
      }
    }
  }, [errors]);

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(input).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // If there are errors, don't submit
    if (Object.keys(formErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    // Prepare form data
    const formData = new FormData();
    
    // Only append changed fields
    if (input.fullname !== user?.fullname) {
      formData.append('fullname', input.fullname.trim());
    }
    if (input.email !== user?.email) {
      formData.append('email', input.email.trim());
    }
    if (input.phoneNumber !== user?.phoneNumber) {
      formData.append('phoneNumber', input.phoneNumber.toString().trim());
    }
    if (input.bio !== user?.profile?.bio) {
      formData.append('bio', input.bio.trim());
    }
    if (input.skills !== (user?.profile?.skills?.join(', ') || '')) {
      formData.append('skills', input.skills.trim());
    }
    
    // Append files if changed
    if (input.resume) {
      formData.append('resume', input.resume);
    }
    if (input.profilePhoto) {
      formData.append('profilePhoto', input.profilePhoto);
    }
    
    // Check if there are any changes
    if (formData.entries().next().done) {
      toast.info('No changes detected');
      return;
    }
    
    try {
      setLoading(true);
      
      // FIX: Changed from POST /profile/update to PATCH /profile/me
      const res = await api.patch('/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || 'Profile updated successfully');
        setOpen(false);
      } else {
        throw new Error(res.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
        
        // Handle specific error codes
        if (error.response.status === 413) {
          errorMessage = 'File size too large. Maximum size is 5MB.';
        } else if (error.response.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render error message
  const renderError = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
          <AlertCircle size={14} />
          <span>{errors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  // Helper to render success indicator
  const renderSuccess = (fieldName) => {
    if (touched[fieldName] && !errors[fieldName] && input[fieldName]) {
      return (
        <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
          <CheckCircle size={14} />
          <span>Looks good!</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. All fields are validated for security.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={submitHandler} noValidate>
          <div className="grid gap-4 py-4">
            {/* Full Name */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="fullname" className="text-right pt-2">
                Name *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className={touched.fullname && errors.fullname ? 'border-red-500' : ''}
                  disabled={loading}
                  required
                  maxLength={50}
                />
                {renderError('fullname')}
                {renderSuccess('fullname')}
                <p className="text-xs text-gray-500">
                  {input.fullname.length}/50 characters
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="email" className="text-right pt-2">
                Email *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className={touched.email && errors.email ? 'border-red-500' : ''}
                  disabled={loading}
                  required
                />
                {renderError('email')}
                {renderSuccess('email')}
              </div>
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="phoneNumber" className="text-right pt-2">
                Phone
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className={touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : ''}
                  disabled={loading}
                  placeholder="+1234567890"
                />
                {renderError('phoneNumber')}
                {renderSuccess('phoneNumber')}
              </div>
            </div>

            {/* Bio */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="text-right pt-2">
                Bio
              </Label>
              <div className="col-span-3 space-y-1">
                <textarea
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  className={`w-full min-h-[80px] p-2 border rounded-md ${touched.bio && errors.bio ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={loading}
                  maxLength={500}
                  rows={3}
                />
                {renderError('bio')}
                {renderSuccess('bio')}
                <p className="text-xs text-gray-500">
                  {input.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="skills" className="text-right pt-2">
                Skills
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  className={touched.skills && errors.skills ? 'border-red-500' : ''}
                  disabled={loading}
                  placeholder="React, Node.js, TypeScript, ..."
                />
                {renderError('skills')}
                {renderSuccess('skills')}
                <p className="text-xs text-gray-500">
                  Separate skills with commas
                </p>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="profilePhoto" className="text-right pt-2">
                Profile Photo
              </Label>
              <div className="col-span-3 space-y-2">
                {user?.profile?.profilePhoto && !input.profilePhoto && (
                  <div className="mb-2 p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                      Current: {user.profile.profilePhoto}
                    </p>
                  </div>
                )}
                <Input
                  id="profilePhoto"
                  name="profilePhoto"
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(',')}
                  onChange={profilePhotoChangeHandler}
                  className={touched.profilePhoto && errors.profilePhoto ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {renderError('profilePhoto')}
                {renderSuccess('profilePhoto')}
                <p className="text-xs text-gray-500">
                  Max size: 5MB. Allowed: JPEG, PNG, GIF, WebP
                </p>
              </div>
            </div>

            {/* Resume */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="resume" className="text-right pt-2">
                Resume
              </Label>
              <div className="col-span-3 space-y-2">
                {user?.profile?.resume && !input.resume && (
                  <div className="mb-2 p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                      Current: {user.profile.resumeOriginalName || user.profile.resume}
                    </p>
                  </div>
                )}
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept={ALLOWED_RESUME_TYPES.join(',')}
                  onChange={resumeChangeHandler}
                  className={touched.resume && errors.resume ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {renderError('resume')}
                {renderSuccess('resume')}
                <p className="text-xs text-gray-500">
                  Max size: 5MB. Allowed: PDF, DOC, DOCX
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Profile...
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="mr-2"
                  disabled={loading}
                >
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

// PropTypes for better development experience
UpdateProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default UpdateProfileDialog;