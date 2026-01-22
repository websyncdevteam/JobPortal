import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

const CompanyAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  
  // Employee states
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    startDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'active'
  });

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || 
           sessionStorage.getItem('authToken') ||
           document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  };

  // Password reset function
  const handleResetPassword = async () => {
    setResetPasswordLoading(true);
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🔄 Resetting password for company:', id);
      
      const response = await fetch(`/api/v1/company/admin/companies/${id}/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: headers
      });

      console.log('Password reset response status:', response.status);

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(`Failed to reset password (${response.status})`);
      }

      const data = await response.json();
      console.log('Password reset response:', data);
      
      if (data.success) {
        alert('✅ Password reset successfully! The new password has been sent to the company email.');
      } else {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('❌ Reset password error:', error);
      alert(`Error resetting password: ${error.message}`);
      
      if (error.message.includes('Session expired') || error.message.includes('No authentication token')) {
        sessionStorage.setItem('returnUrl', window.location.pathname);
        navigate('/login');
      }
    } finally {
      setResetPasswordLoading(false);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/company/admin/companies/${id}/employees`, {
        method: 'GET',
        credentials: 'include',
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEmployees(data.employees || []);
        }
      }
      // If endpoint doesn't exist, continue with mock data for demo
    } catch (error) {
      console.warn('Employees endpoint not available:', error);
      // Continue with mock data for demo
      setEmployees([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@company.com',
          position: 'Software Engineer',
          department: 'Engineering',
          startDate: '2024-01-15',
          status: 'active'
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@company.com',
          position: 'Product Manager',
          department: 'Product',
          startDate: '2024-02-01',
          status: 'active'
        }
      ]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Add new employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/company/admin/companies/${id}/employees`, {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(newEmployee)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEmployees(prev => [...prev, data.employee]);
          setNewEmployee({
            name: '',
            email: '',
            position: '',
            department: '',
            startDate: new Date().toISOString().split('T')[0],
            salary: '',
            status: 'active'
          });
          setShowAddEmployee(false);
          alert('Employee added successfully!');
        }
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  // Update employee
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/company/admin/companies/${id}/employees/${editingEmployee._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(editingEmployee)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEmployees(prev => prev.map(emp => 
            emp._id === editingEmployee._id ? editingEmployee : emp
          ));
          setEditingEmployee(null);
          alert('Employee updated successfully!');
        }
      } else {
        alert('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee');
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (employeeId) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/company/admin/companies/${id}/employees/${employeeId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEmployees(prev => prev.filter(emp => emp._id !== employeeId));
          alert('Employee deleted successfully!');
        }
      } else {
        alert('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  const fetchCompanyAndAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Starting analytics fetch for company:', id);
      
      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Try to fetch company details
      let companyData = null;
      try {
        const companyResponse = await fetch(`/api/v1/company/admin/companies/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers
        });

        console.log('Company response status:', companyResponse.status);

        if (companyResponse.ok) {
          companyData = await companyResponse.json();
          console.log('Company data received:', companyData);
          
          if (companyData.success) {
            setCompany(companyData.company);
          }
        } else if (companyResponse.status === 404) {
          console.log('Company details endpoint not found, continuing without company data');
        } else {
          throw new Error(`Company API error (${companyResponse.status})`);
        }
      } catch (companyError) {
        console.warn('Company details fetch failed, but continuing:', companyError);
      }

      // Fetch analytics
      console.log('📊 Fetching analytics data...');
      const analyticsResponse = await fetch(
        `/api/v1/company/admin/companies/${id}/analytics?period=${period}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: headers
        }
      );

      console.log('Analytics response status:', analyticsResponse.status);

      if (!analyticsResponse.ok) {
        if (analyticsResponse.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (analyticsResponse.status === 403) {
          throw new Error('Admin access required for analytics.');
        } else if (analyticsResponse.status === 404) {
          throw new Error('Analytics endpoint not found. Please check the API route.');
        } else {
          throw new Error(`Analytics server error (${analyticsResponse.status})`);
        }
      }

      const analyticsData = await analyticsResponse.json();
      console.log('Analytics API Response:', analyticsData);

      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
        setRetryCount(0);
      } else {
        throw new Error(analyticsData.message || 'Failed to fetch analytics data');
      }

      // Fetch employees
      await fetchEmployees();

    } catch (error) {
      console.error('❌ Fetch analytics error:', error);
      setError(error.message);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompanyAndAnalytics();
    }
  }, [id, period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleRetry = () => {
    if (retryCount >= 3) {
      window.location.reload();
    } else {
      fetchCompanyAndAnalytics();
    }
  };

  const handleLoginRedirect = () => {
    sessionStorage.setItem('returnUrl', window.location.pathname);
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-10">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/companies')}
            className="mb-4"
          >
            ← Back to Companies
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Loading Analytics...</h1>
              <p className="text-gray-600">Fetching data for company ID: {id}</p>
              {retryCount > 0 && (
                <p className="text-sm text-orange-600">Retry attempt: {retryCount}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
          <div className="bg-gray-200 h-48 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error.includes('Authentication') || error.includes('Access denied') || error.includes('log in');
    const isNotFoundError = error.includes('not found') || error.includes('404') || error.includes('endpoint');
    
    return (
      <div className="max-w-4xl mx-auto my-10">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/companies')}
            className="mb-4"
          >
            ← Back to Companies
          </Button>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          isAuthError ? 'bg-orange-50 border-orange-200' : 
          isNotFoundError ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center mb-4">
            <div className={`text-2xl mr-3 ${
              isAuthError ? 'text-orange-600' : 
              isNotFoundError ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {isAuthError ? '🔐' : isNotFoundError ? '🔍' : '❌'}
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                isAuthError ? 'text-orange-800' : 
                isNotFoundError ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {isAuthError ? 'Authentication Required' : 
                 isNotFoundError ? 'Endpoint Not Found' : 'Failed to Load Analytics'}
              </h2>
              <p className={`text-sm ${
                isAuthError ? 'text-orange-700' : 
                isNotFoundError ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {retryCount > 0 && `(Attempt ${retryCount}/3)`}
              </p>
            </div>
          </div>
          
          <p className={`mb-4 ${
            isAuthError ? 'text-orange-700' : 
            isNotFoundError ? 'text-yellow-700' : 'text-red-700'
          }`}>
            {error}
          </p>
          
          <div className="space-y-2 text-sm mb-4">
            <p><strong>Troubleshooting steps:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              {isAuthError ? (
                <>
                  <li>Your session may have expired</li>
                  <li>You might not have admin privileges</li>
                  <li>Try logging out and back in</li>
                  <li>Clear your browser cookies and cache</li>
                </>
              ) : isNotFoundError ? (
                <>
                  <li>Check if the API endpoint exists</li>
                  <li>Verify the backend server is running</li>
                  <li>Check your API route configuration</li>
                  <li>Contact backend developers about missing routes</li>
                </>
              ) : (
                <>
                  <li>Check your internet connection</li>
                  <li>Verify the backend server is running</li>
                  <li>Check browser console for detailed errors</li>
                  <li>Contact technical support</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {isAuthError ? (
              <>
                <Button 
                  onClick={handleLoginRedirect}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Log In Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </>
            ) : isNotFoundError ? (
              <>
                <Button 
                  onClick={handleRetry}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/admin/companies')}
                >
                  Back to Companies
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleRetry}
                  className={retryCount >= 3 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {retryCount >= 3 ? 'Hard Refresh' : 'Try Again'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/admin/companies')}
                >
                  Back to Companies
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Debug Information */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-3">Technical Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p><strong>Company ID:</strong> {id}</p>
              <p><strong>Selected Period:</strong> {period}</p>
              <p><strong>Retry Attempts:</strong> {retryCount}</p>
              <p><strong>Error Type:</strong> {isNotFoundError ? '404 Not Found' : 'Other'}</p>
            </div>
            <div>
              <p><strong>API Endpoints Attempted:</strong></p>
              <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                GET /api/v1/company/admin/companies/{id}
              </code>
              <code className="text-xs bg-gray-200 p-1 rounded block">
                GET /api/v1/company/admin/companies/{id}/analytics?period={period}
              </code>
            </div>
          </div>
          
          <div className="mt-4">
            <details>
              <summary className="cursor-pointer font-medium text-sm">What this 404 error means</summary>
              <div className="mt-2 text-sm text-gray-600 space-y-2">
                <p>The server returned a 404 Not Found error. This means:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The API endpoint <code>/api/v1/company/admin/companies/{id}/analytics</code> doesn't exist</li>
                  <li>The backend route might be misconfigured or missing</li>
                  <li>The company ID might be invalid (though 404 suggests route issue)</li>
                  <li>There might be a version mismatch in API routes</li>
                </ul>
                <p><strong>Next steps:</strong> Check with your backend team to ensure the analytics endpoint exists and is properly routed.</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/companies')}
          className="mb-4"
        >
          ← Back to Companies
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Analytics {company ? `for ${company.name}` : `- Company ID: ${id}`}
            </h1>
            <p className="text-gray-600">Company ID: {id}</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleResetPassword}
              disabled={resetPasswordLoading}
              variant="outline"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {resetPasswordLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Jobs</h3>
          <p className="text-2xl font-bold">{analytics?.overview?.totalJobs || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
          <p className="text-2xl font-bold text-green-600">{analytics?.overview?.activeJobs || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <p className="text-2xl font-bold">{analytics?.overview?.totalApplications || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Employees</h3>
          <p className="text-2xl font-bold">{employees.length}</p>
        </div>
      </div>

      {/* Employee Management Section */}
      <div className="bg-white rounded-lg border shadow-sm mb-8">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Employee Management</h3>
          <Button 
            onClick={() => setShowAddEmployee(!showAddEmployee)}
            className="bg-green-600 hover:bg-green-700"
          >
            {showAddEmployee ? 'Cancel' : '+ Add Employee'}
          </Button>
        </div>

        {/* Add Employee Form */}
        {showAddEmployee && (
          <div className="p-6 border-b bg-gray-50">
            <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                placeholder="Full Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                required
              />
              <Input
                placeholder="Position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                required
              />
              <Input
                placeholder="Department"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                required
              />
              <Input
                type="date"
                value={newEmployee.startDate}
                onChange={(e) => setNewEmployee({...newEmployee, startDate: e.target.value})}
                required
              />
              <Select 
                value={newEmployee.status} 
                onValueChange={(value) => setNewEmployee({...newEmployee, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowAddEmployee(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Employee
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Employees List */}
        <div className="p-6">
          {employeesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-600">No Employees Found</h3>
              <p className="text-gray-500">Add employees to start tracking your team.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Position</th>
                    <th className="text-left p-4">Department</th>
                    <th className="text-left p-4">Start Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id} className="border-b hover:bg-gray-50">
                      {editingEmployee && editingEmployee._id === employee._id ? (
                        // Edit Mode
                        <>
                          <td className="p-4">
                            <Input
                              value={editingEmployee.name}
                              onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                              className="w-full"
                            />
                          </td>
                          <td className="p-4">
                            <Input
                              type="email"
                              value={editingEmployee.email}
                              onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                              className="w-full"
                            />
                          </td>
                          <td className="p-4">
                            <Input
                              value={editingEmployee.position}
                              onChange={(e) => setEditingEmployee({...editingEmployee, position: e.target.value})}
                              className="w-full"
                            />
                          </td>
                          <td className="p-4">
                            <Input
                              value={editingEmployee.department}
                              onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})}
                              className="w-full"
                            />
                          </td>
                          <td className="p-4">
                            <Input
                              type="date"
                              value={editingEmployee.startDate}
                              onChange={(e) => setEditingEmployee({...editingEmployee, startDate: e.target.value})}
                              className="w-full"
                            />
                          </td>
                          <td className="p-4">
                            <Select 
                              value={editingEmployee.status} 
                              onValueChange={(value) => setEditingEmployee({...editingEmployee, status: value})}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleUpdateEmployee}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Save
                              </Button>
                              <Button 
                                onClick={() => setEditingEmployee(null)}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <td className="p-4 font-medium">{employee.name}</td>
                          <td className="p-4 text-gray-600">{employee.email}</td>
                          <td className="p-4">{employee.position}</td>
                          <td className="p-4">
                            <Badge variant="outline">{employee.department}</Badge>
                          </td>
                          <td className="p-4 text-gray-600">{formatDate(employee.startDate)}</td>
                          <td className="p-4">
                            <Badge 
                              className={employee.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                              }
                            >
                              {employee.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => setEditingEmployee(employee)}
                                variant="outline"
                                size="sm"
                              >
                                Edit
                              </Button>
                              <Button 
                                onClick={() => handleDeleteEmployee(employee._id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;