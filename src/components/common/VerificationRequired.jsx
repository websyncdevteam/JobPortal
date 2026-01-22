// frontend/src/components/common/VerificationRequired.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const VerificationRequired = ({ email }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Email Verification Required
          </h2>
          <p className="text-gray-600 mb-4">
            You need to verify your email before accessing this page.
          </p>
          <p className="text-sm text-gray-500">
            A verification link was sent to: <strong className="text-gray-700">{email}</strong>
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            to="/check-email"
            state={{ email }}
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Go to Verification Page
          </Link>
          
          <Link
            to="/"
            className="block w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Need help?</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Check your spam folder for the verification email
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Contact support if you didn't receive the email
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Make sure you're using the correct email address
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequired;