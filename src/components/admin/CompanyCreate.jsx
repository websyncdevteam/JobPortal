import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../../services/companyservice/api';
import { toast } from 'sonner';

const CompanyCreate = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        contactPerson: '',
        description: '',
        website: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            console.log('Creating company with data:', formData);
            const response = await companyAPI.createCompany(formData);
            
            if (response.success) {
                toast.success('Company created successfully!');
                navigate('/admin/companies');
            } else {
                toast.error(response.message || 'Failed to create company');
            }
        } catch (error) {
            console.error('Create company error:', error);
            
            if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Please make sure the backend is running on port 5000.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to create company');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Company</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Company Name *
                    </label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter company name"
                    />
                    {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="company@example.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Contact Person
                    </label>
                    <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Full name of contact person"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Company description..."
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Website
                        </label>
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="City, Country"
                        />
                    </div>
                </div>

                {/* Connection Status */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="text-yellow-600 mr-2">⚠️</div>
                        <div>
                            <h4 className="text-sm font-medium text-yellow-800">Connection Note</h4>
                            <p className="text-sm text-yellow-700">
                                Make sure your backend server is running on <code>http://localhost:5000</code>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating...
                            </span>
                        ) : (
                            'Create Company'
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/admin/companies')}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyCreate;