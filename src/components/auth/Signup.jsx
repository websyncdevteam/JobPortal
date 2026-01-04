// src/components/auth/Signup.jsx - UPDATED FOR BACKEND COMPATIBILITY
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2, Eye, EyeOff, User, Mail, Phone, Lock, Upload } from 'lucide-react';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateForm = () => {
    if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.confirmPassword) {
      toast.error('Please fill in all fields');
      return false;
    }

    if (input.password !== input.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (input.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(input.phoneNumber)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true; // Removed file requirement for now
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));
      
      // Send registration data without file for now
      const response = await api.post("/auth/register", {
        fullname: input.fullname,
        email: input.email,
        phoneNumber: input.phoneNumber,
        password: input.password
      });

      console.log('Signup API Response:', response.data);

      if (response.data?.success) {
        const userData = response.data.data?.user;
        
        if (userData) {
          dispatch(setUser(userData));
          toast.success(response.data.message || 'Registration successful!');
          
          // Redirect based on role
          const targetPath = userData.role === 'admin' ? '/admin/dashboard' : '/profile';
          navigate(targetPath, { replace: true });
        } else {
          toast.success('Registration successful! Please login.');
          navigate('/login', { replace: true });
        }
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Signup error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Registration failed. Please try again.';
      
      toast.error(errorMessage);
      
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="flex items-center justify-center max-w-7xl mx-auto px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-lg">
              Join us today and start your journey
            </p>
          </div>

          <form
            onSubmit={submitHandler}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 md:p-8 shadow-2xl shadow-blue-100/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="fullname" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeHandler}
                  required
                  placeholder="John Doe"
                  className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeHandler}
                  required
                  placeholder="johndoe@example.com"
                  className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeHandler}
                  required
                  placeholder="1234567890"
                  className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Profile Photo (Optional)
                </Label>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={fileChangeHandler}
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, JPEG. Max size: 5MB
                    </p>
                  </div>
                  {filePreview && (
                    <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden">
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={changeHandler}
                    required
                    placeholder="********"
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={input.confirmPassword}
                    onChange={changeHandler}
                    required
                    placeholder="********"
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200/60 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 underline underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;