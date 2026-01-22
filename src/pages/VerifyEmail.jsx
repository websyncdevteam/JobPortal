import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Mail, Clock, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import api from "@/services/api";

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const emailParam = query.get('email');

  useEffect(() => {
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    
    if (token && emailParam) {
      verifyEmail(token, decodeURIComponent(emailParam));
    } else {
      setStatus('error');
    }
  }, [token, emailParam]);

  const verifyEmail = async (token, email) => {
    try {
      const response = await api.post('/auth/verify-email', { token, email });
      
      if (response.data.success) {
        setStatus('success');
        toast.success('Email verified successfully!');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        toast.error(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      toast.error(error.response?.data?.message || 'Verification failed');
    }
  };

  const resendVerification = async () => {
    try {
      const response = await api.post('/auth/send-verification', { email });
      
      if (response.data.success) {
        toast.success('Verification email sent! Check your inbox.');
      } else {
        toast.error(response.data.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to send verification email');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Verified!</h2>
          <p className="text-gray-600 mb-6">
            Your email has been verified successfully. Redirecting to login...
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Failed</h2>
        <p className="text-gray-600 mb-6">
          The verification link is invalid or has expired.
        </p>
        
        <div className="space-y-4">
          <Button onClick={resendVerification} className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Resend Verification Email
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;