import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import freelancerService from "@/services/freelancer/freelancerService";

const FreelancerProfile = () => {
  const { user, isFreelancer } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialization: [],
    yearsOfExperience: "",
    bio: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const result = await freelancerService.getProfile();
      if (result.success) {
        setProfile(result.data);
        setFormData({
          specialization: result.data.specialization || [],
          yearsOfExperience: result.data.yearsOfExperience || "",
          bio: result.data.bio || ""
        });
      }
    } catch (error) {
      toast.error("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const result = await freelancerService.updateProfile(formData);
      if (result.success) {
        toast.success("Profile updated successfully!");
        setProfile(result.data);
        setEditing(false);
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const specializations = [
    "IT & Software", "Sales & Business Development", "Marketing", 
    "Finance & Accounting", "Healthcare", "Engineering", 
    "Design & Creative", "Other"
  ];

  const handleSpecializationChange = (spec) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isFreelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <p className="text-red-500">Access denied. Freelancer role required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your freelancer profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-row items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <button
                  className={`px-4 py-2 rounded ${
                    editing ? "border border-gray-300 bg-white" : "bg-purple-600 text-white"
                  }`}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
              <div className="space-y-6">
                {/* User Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input 
                      value={user?.fullname} 
                      disabled 
                      className="w-full p-2 border rounded bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      value={user?.email} 
                      disabled 
                      className="w-full p-2 border rounded bg-gray-50"
                    />
                  </div>
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium mb-2">Referral Code</label>
                  <div className="flex items-center gap-2">
                    <input 
                      value={profile?.referralCode} 
                      disabled 
                      className="w-full p-2 border rounded bg-gray-50 font-mono"
                    />
                    <button
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                      onClick={() => {
                        navigator.clipboard.writeText(profile?.referralCode);
                        toast.success("Referral code copied!");
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Share this code with candidates when submitting them
                  </p>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium mb-2">Specialization</label>
                  {editing ? (
                    <div className="grid grid-cols-2 gap-3">
                      {specializations.map(spec => (
                        <div key={spec} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={spec}
                            checked={formData.specialization.includes(spec)}
                            onChange={() => handleSpecializationChange(spec)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor={spec} className="text-sm cursor-pointer">
                            {spec}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile?.specialization?.map(spec => (
                        <span key={spec} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-medium mb-2">Years of Experience</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        yearsOfExperience: e.target.value
                      }))}
                      className="w-full p-2 border rounded"
                      min="0"
                      max="50"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile?.yearsOfExperience} years
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Bio</label>
                  {editing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bio: e.target.value
                      }))}
                      rows={4}
                      className="w-full p-2 border rounded resize-none"
                      placeholder="Describe your professional background and expertise..."
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {profile?.bio || "No bio provided"}
                    </p>
                  )}
                </div>

                {/* Save Button */}
                {editing && (
                  <button 
                    onClick={handleSave} 
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Approval Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Account Status</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                profile?.approved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile?.approved ? '✅ Approved' : '⏳ Pending Approval'}
              </div>
              {profile?.approved && profile?.approvedAt && (
                <p className="text-sm text-gray-600 mt-2">
                  Approved on {new Date(profile.approvedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Placements</span>
                  <span className="font-semibold">{profile?.totalPlacements || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold">{profile?.successRate || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold">${profile?.totalEarnings?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Payouts</span>
                  <span className="font-semibold">${profile?.pendingPayouts?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button 
                  className="w-full flex items-center gap-2 border border-gray-300 bg-white py-2 px-4 rounded hover:bg-gray-50"
                  onClick={() => window.location.href = '/freelancer/dashboard'}
                >
                  📊 Dashboard
                </button>
                <button 
                  className="w-full flex items-center gap-2 border border-gray-300 bg-white py-2 px-4 rounded hover:bg-gray-50"
                  onClick={() => window.location.href = '/freelancer/placements'}
                >
                  📋 My Placements
                </button>
                <button 
                  className="w-full flex items-center gap-2 border border-gray-300 bg-white py-2 px-4 rounded hover:bg-gray-50"
                  onClick={() => window.location.href = '/freelancer/earnings'}
                >
                  💰 Earnings
                </button>
                <button 
                  className="w-full flex items-center gap-2 border border-gray-300 bg-white py-2 px-4 rounded hover:bg-gray-50"
                  onClick={() => window.location.href = '/freelancer/payouts'}
                >
                  💳 Payouts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;