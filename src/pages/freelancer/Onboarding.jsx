import { useState } from "react";

const FreelancerOnboarding = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simple form for now
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/freelancer/dashboard";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-purple-700 mb-4">
            🚀 Freelancer Onboarding
          </h1>
          <p className="text-gray-600 mb-6">
            Simple onboarding form - we'll add more features later
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Specialization</label>
              <input 
                type="text" 
                placeholder="e.g., IT & Software"
                className="w-full p-2 border rounded"
                required
              />
            </div>  
            
            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <input 
                type="number" 
                placeholder="e.g., 5"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea 
                placeholder="Tell us about your experience..."
                rows="4"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Creating Profile..." : "Complete Onboarding"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreelancerOnboarding;