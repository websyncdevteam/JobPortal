// frontend/src/pages/CheckEmail.jsx - CORRECTED
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/authService'; // ✅ Change from authService to authAPI

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setMessage(location.state.message || 'Please verify your email to continue');
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await authAPI.sendVerification(email); // ✅ Use authAPI
      if (response.success) {
        setMessage('✅ Verification email sent! Check your inbox.');
      } else {
        setMessage('⚠️ ' + (response.message || 'Failed to resend email'));
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('❌ Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                We sent a verification link to: <br />
                <strong className="text-gray-700 text-base">{email}</strong>
              </p>
            </div>

            <div>
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Back to Login
              </Link>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Didn't receive the email?
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Check your spam folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes and try again</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;