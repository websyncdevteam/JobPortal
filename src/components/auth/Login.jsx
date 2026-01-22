// src/pages/Login.jsx - COMPATIBLE PRODUCTION READY VERSION
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  AlertCircle, 
  Mail, 
  Lock, 
  Loader2,
  CheckCircle,
  XCircle,
  UserCheck
} from 'lucide-react';

// Components - Only use what exists in your project
//import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Redux & Services
import { setLoading, setCredentials } from '@/redux/authSlice';
import api from '@/services/api';

// Constants
const SECURITY_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCK_DURATION: 15 * 60 * 1000, // 15 minutes
};

const ROLE_REDIRECTS = {
  admin: '/admin/dashboard',
  recruiter: '/recruiter/dashboard',
  freelancer: '/freelancer/dashboard',
  company: '/company/dashboard',
  user: '/profile',
  candidate: '/profile'
};

const Login = () => {
  // State Management
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [uiState, setUiState] = useState({
    showPassword: false,
    isSubmitting: false,
    isLocked: false,
    lockUntil: null
  });
  const [security, setSecurity] = useState({
    attempts: 0,
    securityLevel: 'none',
    passwordChecks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  // Refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Hooks
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  // Security & Session Management
  useEffect(() => {
    // Load security state from localStorage
    const loadSecurityState = () => {
      try {
        const lockData = localStorage.getItem('loginLock');
        const attemptData = localStorage.getItem('loginAttempts');
        
        if (lockData) {
          const { until } = JSON.parse(lockData);
          if (new Date(until) > new Date()) {
            setUiState(prev => ({ ...prev, isLocked: true, lockUntil: until }));
          } else {
            localStorage.removeItem('loginLock');
          }
        }

        if (attemptData) {
          const { count, timestamp } = JSON.parse(attemptData);
          // Reset attempts if older than 1 hour
          if (Date.now() - timestamp < 3600000) {
            setSecurity(prev => ({ ...prev, attempts: count }));
          } else {
            localStorage.removeItem('loginAttempts');
          }
        }
      } catch (error) {
        console.error('Error loading security state:', error);
        localStorage.removeItem('loginLock');
        localStorage.removeItem('loginAttempts');
      }
    };

    loadSecurityState();
  }, []);

  // Password strength analysis
  const analyzePassword = useCallback((password) => {
    if (!password) {
      setSecurity(prev => ({ 
        ...prev, 
        securityLevel: 'none',
        passwordChecks: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false
        }
      }));
      return;
    }

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const level = score >= 4 ? 'high' : score >= 3 ? 'medium' : score >= 2 ? 'low' : 'very-low';

    setSecurity(prev => ({ 
      ...prev, 
      securityLevel: level,
      passwordChecks: checks
    }));
  }, []);

  // Enhanced input handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Analyze password in real-time
      if (field === 'password') {
        setTimeout(() => analyzePassword(value), 150);
      }
      
      return newData;
    });
  }, [analyzePassword]);

  // Security level indicators
  const securityIndicators = useMemo(() => ({
    'very-low': { color: 'text-red-600', bg: 'bg-red-500', label: 'Very Weak' },
    'low': { color: 'text-orange-600', bg: 'bg-orange-500', label: 'Weak' },
    'medium': { color: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Medium' },
    'high': { color: 'text-green-600', bg: 'bg-green-500', label: 'Strong' },
    'none': { color: 'text-gray-600', bg: 'bg-gray-300', label: 'None' }
  }), []);

  // Form validation
  const validateForm = useCallback(() => {
    const { email, password } = formData;

    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      emailRef.current?.focus();
      return false;
    }

  //  if (password.length < 6) {
    //  toast.error('Password must be at least 6 characters long');
      //passwordRef.current?.focus();
      //return false;
    //}

    return true;
  }, [formData]);

  // Enhanced failed attempt handler
  const handleFailedAttempt = useCallback(() => {
    const newAttempts = security.attempts + 1;
    setSecurity(prev => ({ ...prev, attempts: newAttempts }));

    // Persist attempts
    localStorage.setItem('loginAttempts', JSON.stringify({
      count: newAttempts,
      timestamp: Date.now()
    }));

    if (newAttempts >= SECURITY_CONFIG.MAX_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + SECURITY_CONFIG.LOCK_DURATION);
      setUiState(prev => ({ ...prev, isLocked: true, lockUntil }));
      
      localStorage.setItem('loginLock', JSON.stringify({
        until: lockUntil,
        reason: 'MAX_ATTEMPTS_EXCEEDED',
        attempts: newAttempts
      }));

      toast.error(`Too many failed attempts. Please try again in ${SECURITY_CONFIG.LOCK_DURATION / 60000} minutes.`);
    } else if (newAttempts >= 3) {
      toast.warning(`${SECURITY_CONFIG.MAX_ATTEMPTS - newAttempts} attempts remaining before lockout`);
    }
  }, [security.attempts]);

  // Enhanced login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (uiState.isLocked || uiState.isSubmitting || loading) return;

    if (!validateForm()) return;

    setUiState(prev => ({ ...prev, isSubmitting: true }));
    dispatch(setLoading(true));

    try {
      const response = await api.post('/auth/login', formData);
      const data = response?.data || {};

      if (!data.success) {
        throw new Error(data?.message || 'Authentication failed');
      }

      // Handle different response structures
      const userData = data.data?.user || data.user;
      const token = data.data?.token || data.token;

      if (!userData || !token) {
        throw new Error('Invalid response format from server');
      }

      // Successful login
      dispatch(setCredentials({ user: userData, token }));
      
      // Reset security state
      setSecurity(prev => ({ ...prev, attempts: 0 }));
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('loginLock');

      toast.success(`Welcome back!`);

      // Redirect
      const redirectTo = from || ROLE_REDIRECTS[userData.role] || '/dashboard';
      navigate(redirectTo, { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      
      handleFailedAttempt();

      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Network error. Please check your connection.';

      toast.error(errorMessage);

    } finally {
      setUiState(prev => ({ ...prev, isSubmitting: false }));
      dispatch(setLoading(false));
    }
  };

  // Lock screen countdown
  const LockScreen = () => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
      const updateCountdown = () => {
        const now = new Date();
        const lockTime = new Date(uiState.lockUntil);
        const diff = lockTime - now;
        
        if (diff <= 0) {
          setUiState(prev => ({ ...prev, isLocked: false, lockUntil: null }));
          localStorage.removeItem('loginLock');
          return;
        }
        
        setTimeLeft(Math.ceil(diff / 1000));
      };

      const interval = setInterval(updateCountdown, 1000);
      updateCountdown();
      
      return () => clearInterval(interval);
    }, [uiState.lockUntil]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-red-200 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-red-700 mb-3">Account Temporarily Locked</h2>
          <p className="text-lg text-red-600 mb-4">
            Security measures activated due to multiple failed attempts
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-red-700 mb-2">Time remaining:</div>
            <div className="text-3xl font-mono font-bold text-red-800">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/forgot-password')}
              className="w-full"
            >
              Reset Password
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="w-full text-gray-600"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (uiState.isLocked) {
    return <LockScreen />;
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
     
      
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="p-3 bg-blue-100 rounded-2xl mx-auto w-fit">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Secure Login
            </h1>
            <p className="text-gray-600 mt-2">Access your account securely</p>
            
            {/* Security Badge */}
            {security.attempts > 0 && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-3 ${
                security.attempts >= 3 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
              }`}>
                <AlertCircle className="w-3 h-3 mr-1" />
                {security.attempts} failed attempt{security.attempts !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <Label className="flex gap-2 items-center text-gray-700">
                  <Mail className="w-4 h-4" /> Email Address
                </Label>
                <Input
                  ref={emailRef}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12 mt-2"
                  placeholder="your.email@company.com"
                  disabled={uiState.isSubmitting || loading}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center">
                  <Label className="flex gap-2 items-center text-gray-700">
                    <Lock className="w-4 h-4" /> Password
                  </Label>

                  <button
                    type="button"
                    onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    className="text-blue-600 text-sm flex items-center gap-1"
                  >
                    {uiState.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {uiState.showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <Input
                  ref={passwordRef}
                  type={uiState.showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="h-12 mt-2"
                  placeholder="Enter your password"
                  disabled={uiState.isSubmitting || loading}
                  required
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="font-medium">Password Strength</span>
                      <span className={`font-semibold ${
                        securityIndicators[security.securityLevel].color
                      }`}>
                        {securityIndicators[security.securityLevel].label}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          securityIndicators[security.securityLevel].bg
                        } ${
                          security.securityLevel === 'very-low' ? 'w-1/4' :
                          security.securityLevel === 'low' ? 'w-2/4' :
                          security.securityLevel === 'medium' ? 'w-3/4' : 'w-full'
                        }`}
                      />
                    </div>

                    {/* Password Requirements */}
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {Object.entries(security.passwordChecks).map(([key, met]) => (
                        <div key={key} className="flex items-center gap-2">
                          {met ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={met ? 'text-green-600' : 'text-gray-500'}>
                            {key === 'length' && 'At least 8 characters'}
                            {key === 'uppercase' && 'One uppercase letter'}
                            {key === 'lowercase' && 'One lowercase letter'}
                            {key === 'number' && 'One number'}
                            {key === 'special' && 'One special character'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={uiState.isSubmitting || loading}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200"
              >
                {(uiState.isSubmitting || loading) ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Sign In Securely
                  </>
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="text-center mt-6 space-y-3">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link className="text-blue-600 font-semibold hover:text-blue-700" to="/signup">
                  Create one now
                </Link>
              </p>
              <p className="text-gray-600">
                Forgot your password?{' '}
                <Link className="text-purple-600 font-semibold hover:text-purple-700" to="/forgot-password">
                  Reset it here
                </Link>
              </p>
            </div>

            {/* Security Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4 pt-4 border-t">
              <Shield className="w-3 h-3" />
              <span>Protected by advanced security measures</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;