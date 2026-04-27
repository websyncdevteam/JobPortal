// src/components/recruiter/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';
import { toast } from 'sonner';
import { 
  User, Mail, Phone, Lock, Save, Shield, Key, 
  Eye, EyeOff, Building, Users, Briefcase, Loader 
} from 'lucide-react';

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [companies, setCompanies] = useState([]);
  
  const [profileForm, setProfileForm] = useState({
    fullname: '',
    phoneNumber: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchTeamAndCompanies = async () => {
      try {
        const [teamRes, companiesRes] = await Promise.all([
          api.get('/team').catch(() => ({ data: null })),
          api.get('/team/companies').catch(() => ({ data: { data: [] } }))
        ]);
        setTeamData(teamRes.data?.team || null);
        setCompanies(companiesRes.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch team data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setProfileForm({
        fullname: user.fullname || '',
        phoneNumber: user.phoneNumber || '',
      });
      fetchTeamAndCompanies();
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put('/user/profile', {
        fullname: profileForm.fullname,
        phoneNumber: profileForm.phoneNumber,
      });
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setUpdating(true);
    try {
      await api.put('/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account Security', icon: Shield },
    { id: 'team', label: 'Team & Companies', icon: Users },
  ];

  const renderProfileTab = () => (
    <form onSubmit={handleProfileSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={profileForm.fullname}
            onChange={handleProfileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={profileForm.phoneNumber}
            onChange={handleProfileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <input
            type="text"
            value={user?.role === 'recruiter' ? 'Recruiter' : user?.role || 'User'}
            disabled
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updating}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
        >
          {updating ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          Save Profile
        </button>
      </div>
    </form>
  );

  const renderAccountTab = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <Key className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Password Security</h4>
            <p className="text-sm text-yellow-700">Update your password regularly.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">At least 8 characters with uppercase, lowercase, and numbers</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updating}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
        >
          {updating ? <Loader size={18} className="animate-spin" /> : <Save size{18} />}
          Change Password
        </button>
      </div>
    </form>
  );

  const renderTeamTab = () => {
    if (loading) return <div className="flex justify-center py-8"><Loader className="animate-spin text-indigo-600" size={32} /></div>;
    return (
      <div className="space-y-6">
        {teamData ? (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Users size={20} className="text-indigo-600" />
              {teamData.name}
            </h3>
            {teamData.description && <p className="text-gray-600 mb-4">{teamData.description}</p>}
            <div className="border-t border-indigo-100 pt-4 mt-2">
              <p className="text-sm text-gray-500 mb-2">Assigned Companies</p>
              {companies.length > 0 ? (
                <ul className="space-y-2">
                  {companies.map(company => (
                    <li key={company._id} className="flex items-center gap-2 text-gray-700">
                      <Building size={16} />
                      {company.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No companies assigned yet</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <Users size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">You are not assigned to any team yet.</p>
            <p className="text-sm text-gray-500 mt-1">Contact your admin to be added to a team.</p>
          </div>
        )}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-600" />
            Work Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{companies.length}</p>
              <p className="text-sm text-gray-600">Companies Assigned</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{teamData ? '✓' : '—'}</p>
              <p className="text-sm text-gray-600">Team Member</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600 capitalize">{user?.role || '—'}</p>
              <p className="text-sm text-gray-600">Role</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account, team, and security preferences</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {(() => {
              switch (activeTab) {
                case 'profile': return renderProfileTab();
                case 'account': return renderAccountTab();
                case 'team': return renderTeamTab();
                default: return renderProfileTab();
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
