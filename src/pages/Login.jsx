import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Fade,
  Zoom,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Security,
  Person
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('low');
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || getDashboardRoute(user.role);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Check if account is temporarily locked
  useEffect(() => {
    const checkLockStatus = () => {
      if (lockUntil && new Date() < lockUntil) {
        const minutesLeft = Math.ceil((lockUntil - new Date()) / 60000);
        setError(`Account temporarily locked. Try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`);
        return true;
      }
      setLockUntil(null);
      return false;
    };

    checkLockStatus();
  }, [lockUntil]);

  // Assess password security level
  useEffect(() => {
    if (formData.password.length === 0) {
      setSecurityLevel('low');
      return;
    }

    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;

    setSecurityLevel(score >= 3 ? 'high' : score >= 2 ? 'medium' : 'low');
  }, [formData.password]);

  const getDashboardRoute = (role) => {
    const routes = {
      admin: '/admin/dashboard',
      recruiter: '/recruiter/dashboard',
      freelancer: '/freelancer/dashboard',
      company: '/company/dashboard'
    };
    return routes[role] || '/dashboard';
  };

  const getSecurityColor = () => {
    switch (securityLevel) {
      case 'high': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'low': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if account is locked
    if (lockUntil && new Date() < lockUntil) {
      return;
    }

    if (!validateForm()) return;

    try {
      setError('');
      setLoading(true);

      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Reset attempts on successful login
        setAttempts(0);
        
        // Use timeout to ensure context is updated
        setTimeout(() => {
          const targetRoute = getDashboardRoute(user?.role);
          navigate(targetRoute, { 
            replace: true,
            state: { from: location }
          });
        }, 100);
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Increment failed attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Implement progressive locking
      if (newAttempts >= 5) {
        const lockTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        setLockUntil(lockTime);
        setError('Too many failed attempts. Account locked for 15 minutes.');
      } else if (newAttempts >= 3) {
        setError(`Invalid credentials. ${5 - newAttempts} attempts remaining before lock.`);
      } else {
        setError(error.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      admin: { email: 'admin@demo.com', password: 'demo123' },
      recruiter: { email: 'recruiter@demo.com', password: 'demo123' },
      freelancer: { email: 'freelancer@demo.com', password: 'demo123' },
      company: { email: 'company@demo.com', password: 'demo123' }
    };

    const credentials = demoCredentials[role];
    if (credentials) {
      setFormData(credentials);
    }
  };

  // Security tips component
  const SecurityTips = () => (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        🔒 Security Tips:
      </Typography>
      <Typography variant="body2" color="textSecondary">
        • Use strong, unique passwords<br/>
        • Enable two-factor authentication<br/>
        • Never share your credentials<br/>
        • Log out from shared devices
      </Typography>
    </Box>
  );

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Zoom in={true} timeout={800}>
        <Paper 
          elevation={24}
          sx={{
            padding: isMobile ? 3 : 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 450,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Security 
              sx={{ 
                fontSize: 48, 
                color: 'primary.main',
                mb: 1
              }} 
            />
            <Typography 
              component="h1" 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Secure Login
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Access your company dashboard securely
            </Typography>
          </Box>

          {/* Error Alert */}
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                borderRadius: 2
              }}
            >
              {error}
            </Alert>
          </Fade>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* Email Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email 
                      color={focusedField === 'email' ? 'primary' : 'action'} 
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)'
                  }
                }
              }}
            />

            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange('password')}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock 
                      color={focusedField === 'password' ? 'primary' : 'action'} 
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)'
                  }
                }
              }}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <Fade in={!!formData.password}>
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Password Strength: 
                    <span style={{ color: getSecurityColor(), fontWeight: 'bold', marginLeft: 4 }}>
                      {securityLevel.toUpperCase()}
                    </span>
                  </Typography>
                  <Box 
                    sx={{ 
                      height: 4, 
                      backgroundColor: '#e0e0e0', 
                      borderRadius: 2, 
                      mt: 0.5,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: '100%', 
                        backgroundColor: getSecurityColor(),
                        width: securityLevel === 'high' ? '100%' : securityLevel === 'medium' ? '66%' : '33%',
                        transition: 'all 0.3s ease'
                      }} 
                    />
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || (lockUntil && new Date() < lockUntil)}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                },
                '&:disabled': {
                  background: '#bdbdbd'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          {/* Demo Accounts Section */}
          <Box sx={{ width: '100%', mt: 2 }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Demo Accounts
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {['admin', 'recruiter', 'freelancer', 'company'].map((role) => (
                <Button
                  key={role}
                  variant="outlined"
                  size="small"
                  startIcon={<Person />}
                  onClick={() => handleDemoLogin(role)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'capitalize',
                    fontSize: '0.75rem'
                  }}
                >
                  {role}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Security Tips */}
          <SecurityTips />

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              🔐 Secure Authentication System v2.0
            </Typography>
          </Box>
        </Paper>
      </Zoom>
    </Container>
  );
};

export default Login;