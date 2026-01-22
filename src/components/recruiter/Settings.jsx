import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Globe, 
  Save, 
  Shield,
  Key,
  Upload,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react';

const RecruiterSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'recruiter@example.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Senior Recruiter',
    company: 'Tech Recruiters Inc.',
    bio: 'Experienced recruiter with 5+ years in tech industry',
    notifications: {
      emailNotifications: true,
      applicationAlerts: true,
      interviewReminders: true,
      newsletter: false,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false,
      dataSharing: true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: Globe },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving settings:', formData);
    // Here you would call your API to save settings
    alert('Settings saved successfully!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Uploading file:', file.name);
      // Handle file upload logic here
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
            <Camera size={16} />
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-500">Recommended: Square JPG, PNG at least 400px</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail size={16} className="inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone size={16} className="inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <Key className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Password Security</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Update your password regularly to keep your account secure.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Account Actions</h4>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-red-600 hover:text-red-700">
            Request Data Export
          </button>
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-red-600 hover:text-red-700">
            Deactivate Account
          </button>
          <button className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
        {Object.entries(formData.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <p className="font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {key === 'emailNotifications' && 'Receive all email notifications'}
                {key === 'applicationAlerts' && 'Get alerts for new applications'}
                {key === 'interviewReminders' && 'Reminders for upcoming interviews'}
                {key === 'newsletter' && 'Weekly newsletter and updates'}
                {key === 'marketingEmails' && 'Promotional offers and announcements'}
              </p>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleInputChange({
                  target: { name: `notifications.${key}`, type: 'checkbox', checked: !value }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['Real-time', 'Daily Digest', 'Weekly Summary'].map((freq) => (
            <button
              key={freq}
              className={`px-4 py-3 border rounded-lg text-center transition-colors ${
                freq === 'Real-time'
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Visibility
          </label>
          <select
            name="privacy.profileVisibility"
            value={formData.privacy.profileVisibility}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="public">Public - Anyone can see</option>
            <option value="recruiters">Recruiters Only</option>
            <option value="private">Private - Only Me</option>
          </select>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
          {[
            { key: 'showEmail', label: 'Show email address to candidates' },
            { key: 'showPhone', label: 'Show phone number to candidates' },
            { key: 'dataSharing', label: 'Allow data sharing for analytics' }
          ].map((item) => (
            <div key={item.key} className="flex items-center">
              <input
                type="checkbox"
                name={`privacy.${item.key}`}
                checked={formData.privacy[item.key]}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm text-gray-700">
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Data Privacy</h4>
        <p className="text-sm text-gray-600 mb-3">
          We respect your privacy. Your data is encrypted and stored securely.
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View Privacy Policy →
        </button>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Google Calendar', icon: '📅', connected: true },
          { name: 'Slack', icon: '💬', connected: true },
          { name: 'Zoom', icon: '🎥', connected: false },
          { name: 'LinkedIn', icon: '💼', connected: false },
          { name: 'Gmail', icon: '📧', connected: true },
          { name: 'Outlook', icon: '📨', connected: false },
        ].map((integration) => (
          <div key={integration.name} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{integration.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-500">
                    {integration.connected ? 'Connected' : 'Not Connected'}
                  </p>
                </div>
              </div>
              {integration.connected ? (
                <span className="flex items-center text-green-600 text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  Active
                </span>
              ) : (
                <span className="flex items-center text-gray-500 text-sm">
                  <XCircle size={16} className="mr-1" />
                  Inactive
                </span>
              )}
            </div>
            <button className={`w-full py-2 rounded-lg text-sm transition-colors ${
              integration.connected
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}>
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'account':
        return renderAccountTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'integrations':
        return renderIntegrationsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
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
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
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

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit}>
              {renderTabContent()}
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSettings;