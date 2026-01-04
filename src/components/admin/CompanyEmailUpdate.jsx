import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/StatCard';
import { toast } from 'sonner';

const CompanyEmailUpdate = ({ company, onUpdate }) => {
  const [email, setEmail] = useState(company?.email || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    if (email === company?.email) {
      setErrors({ email: 'New email must be different from current email' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/company/admin/companies/${company._id}/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Company email updated successfully!');
        setEmail(data.company.email);
        onUpdate?.(data.company);
      } else {
        toast.error(data.message || 'Failed to update email');
        setErrors({ submit: data.message });
      }
    } catch (error) {
      console.error('Email update error:', error);
      toast.error('Failed to update email. Please try again.');
      setErrors({ submit: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Company Email</CardTitle>
        <p className="text-sm text-gray-600">
          Change the email address associated with this company account.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Current Email</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-gray-800 font-medium">{company?.email}</p>
            </div>
          </div>

          {/* New Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              New Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="Enter new email address"
              className={errors.email ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-600 mr-2">ℹ️</div>
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">Security Notice</h4>
                <p className="text-sm text-blue-700">
                  Changing the company email will:
                </p>
                <ul className="text-sm text-blue-700 list-disc list-inside mt-1 space-y-1">
                  <li>Update the login email for this company</li>
                  <li>Require email verification for the new address</li>
                  <li>Send a notification to the current email address</li>
                  <li>Be recorded in the company activity log</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmail(company?.email || '')}
              disabled={loading}
            >
              Reset
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading || email === company?.email}
              className="min-w-32"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Email'
              )}
            </Button>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyEmailUpdate;