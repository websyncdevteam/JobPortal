// frontend/src/components/recruiter/JobForm.jsx - FINAL COMPLETE VERSION

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Loader, 
  Building, 
  AlertCircle, 
  MapPin, 
  DollarSign, 
  Briefcase,
  Award,
  Tag,
  Calendar,
  Globe,
  FileText,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useRecruiter } from '../../context/RecruiterContext';
import { useAuth } from '../../context/authContext';

const JobForm = ({ job, onClose }) => {
  const { 
    createJob, 
    updateJob, 
    loading, 
    recruiterCompanies, 
    fetchRecruiterCompanies, 
    hasCompanies,
    isCompaniesLoading 
  } = useRecruiter();
  
  const { user } = useAuth();
  
  // 🔥 COMPLETE FORM STATE
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    
    // Company & Location
    company: '',
    location: '',
    isRemote: false,
    workMode: 'onsite', // onsite, remote, hybrid
    
    // Salary Information
    salary: '',
    salaryType: 'annual', // annual, monthly, hourly
    salaryCurrency: 'USD',
    showSalary: true,
    
    // Job Details
    jobType: 'full-time',
    experienceLevel: 'mid',
    category: '',
    industry: '',
    tags: [],
    
    // Requirements & Qualifications
    requirements: '',
    skills: [],
    education: '',
    certifications: '',
    
    // Benefits & Perks
    benefits: '',
    perks: [],
    
    // Application Process
    applicationDeadline: '',
    applicationInstructions: '',
    applicationUrl: '',
    
    // Contact Information
    contactEmail: '',
    contactPhone: '',
    
    // Additional Information
    vacancies: 1,
    urgent: false,
    featured: false
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentPerk, setCurrentPerk] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 JOB TYPES
  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'volunteer', label: 'Volunteer' }
  ];

  // 🔥 EXPERIENCE LEVELS
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (2-5 years)' },
    { value: 'senior', label: 'Senior Level (5-8 years)' },
    { value: 'lead', label: 'Lead (8+ years)' },
    { value: 'executive', label: 'Executive' }
  ];

  // 🔥 WORK MODES
  const workModes = [
    { value: 'onsite', label: 'On-Site' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  // 🔥 SALARY TYPES
  const salaryTypes = [
    { value: 'annual', label: 'Annual Salary' },
    { value: 'monthly', label: 'Monthly Salary' },
    { value: 'hourly', label: 'Hourly Rate' }
  ];

  // 🔥 CURRENCIES
  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'INR', label: 'INR (₹)' }
  ];

  // 🔥 INITIALIZATION
  useEffect(() => {
    fetchRecruiterCompanies();
  }, [fetchRecruiterCompanies]);

  useEffect(() => {
    if (job) {
      // Editing existing job
      setFormData({
        title: job.title || '',
        description: job.description || '',
        company: job.company?._id || job.company || '',
        location: job.location || '',
        isRemote: job.isRemote || false,
        workMode: job.workMode || 'onsite',
        salary: job.salary || '',
        salaryType: job.salaryType || 'annual',
        salaryCurrency: job.salaryCurrency || 'USD',
        showSalary: job.showSalary !== false,
        jobType: job.jobType || 'full-time',
        experienceLevel: job.experienceLevel || 'mid',
        category: job.category || '',
        industry: job.industry || '',
        tags: job.tags || [],
        requirements: job.requirements?.join(', ') || '',
        skills: job.skills || [],
        education: job.education || '',
        certifications: job.certifications || '',
        benefits: job.benefits || '',
        perks: job.perks || [],
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
        applicationInstructions: job.applicationInstructions || '',
        applicationUrl: job.applicationUrl || '',
        contactEmail: job.contactEmail || '',
        contactPhone: job.contactPhone || '',
        vacancies: job.vacancies || 1,
        urgent: job.urgent || false,
        featured: job.featured || false
      });
    } else if (hasCompanies && recruiterCompanies.length === 1) {
      // Auto-select if only one company
      setFormData(prev => ({
        ...prev,
        company: recruiterCompanies[0]._id
      }));
    }
  }, [job, recruiterCompanies, hasCompanies]);

  // 🔥 VALIDATION
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Job title is required';
    if (!formData.description.trim()) errors.description = 'Job description is required';
    if (!formData.company) errors.company = 'Please select a company';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.requirements.trim()) errors.requirements = 'Requirements are required';
    if (formData.applicationDeadline && new Date(formData.applicationDeadline) < new Date()) {
      errors.applicationDeadline = 'Deadline must be in the future';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 🔥 FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors before submitting.');
      return;
    }
    
    if (!hasCompanies) {
      alert("No companies assigned. Please contact admin to assign companies.");
      return;
    }
    
    if (!formData.company) {
      alert("Please select a company for this job posting.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req),
        skills: formData.skills,
        tags: formData.tags,
        perks: formData.perks,
        isRemote: formData.workMode === 'remote',
        // Convert empty strings to null for optional fields
        applicationUrl: formData.applicationUrl || null,
        contactEmail: formData.contactEmail || null,
        contactPhone: formData.contactPhone || null
      };

      console.log("📤 Submitting job data:", submitData);
      
      let result;
      if (job) {
        result = await updateJob(job._id, submitData);
      } else {
        result = await createJob(submitData);
      }
      
      if (result.success) {
        onClose();
      } else {
        alert(result.error || 'Failed to save job');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 FORM HANDLERS
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayAdd = (field, value, setCurrentValue) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setCurrentValue('');
    }
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const selectedCompany = recruiterCompanies.find(comp => comp._id === formData.company);

  // 🔥 RENDER FUNCTIONS
  const renderArrayInput = (field, currentValue, setCurrentValue, placeholder, icon) => (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}
          <input
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd(field, currentValue, setCurrentValue))}
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
        </div>
        <button
          type="button"
          onClick={() => handleArrayAdd(field, currentValue, setCurrentValue)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add
        </button>
      </div>
      {formData[field].length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData[field].map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              {item}
              <button
                type="button"
                onClick={() => handleArrayRemove(field, index)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  // 🔥 MAIN COMPONENT
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {job ? 'Edit Job' : 'Post New Job'}
            </h2>
            <p className="text-gray-600 mt-1">
              {job ? 'Update the job details' : 'Fill in all the required information to post a new job'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* 🔥 SECTION 1: COMPANY SELECTION */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Building className="text-blue-600 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-blue-800">Company & Basic Information</h3>
            </div>
            
            {isCompaniesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="animate-spin text-blue-600 mr-2" size={20} />
                <span className="text-blue-600">Loading companies...</span>
              </div>
            ) : hasCompanies ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Selection */}
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Select Company *
                  </label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border ${
                      formErrors.company ? 'border-red-300' : 'border-blue-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`}
                  >
                    <option value="">-- Select a Company --</option>
                    {recruiterCompanies.map(company => (
                      <option key={company._id} value={company._id}>
                        {company.name} {company.status !== 'active' ? `(${company.status})` : ''}
                      </option>
                    ))}
                  </select>
                  {formErrors.company && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.company}</p>
                  )}
                </div>

                {/* Company Preview */}
                {selectedCompany && (
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedCompany.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedCompany.email && `Email: ${selectedCompany.email}`}
                          {selectedCompany.location && ` • Location: ${selectedCompany.location}`}
                        </p>
                        {selectedCompany.industry && (
                          <p className="text-sm text-gray-500 mt-1">Industry: {selectedCompany.industry}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCompany.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedCompany.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded p-4">
                <div className="flex items-center">
                  <AlertCircle size={20} className="mr-2" />
                  <div>
                    <p className="font-medium">No Companies Assigned</p>
                    <p className="text-sm mt-1">
                      You don't have any companies assigned to you. Please contact the administrator to assign companies before posting jobs.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Only show form if companies exist */}
          {hasCompanies && (
            <>
              {/* 🔥 SECTION 2: JOB DETAILS */}
              <section className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="text-indigo-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border ${
                        formErrors.title ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="e.g. Senior Frontend Developer"
                    />
                    {formErrors.title && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Location & Work Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-1" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border ${
                        formErrors.location ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="e.g. New York, NY or Remote"
                    />
                    {formErrors.location && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe size={16} className="inline mr-1" />
                      Work Mode
                    </label>
                    <select
                      name="workMode"
                      value={formData.workMode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {workModes.map(mode => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Job Type & Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {jobTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Award size={16} className="inline mr-1" />
                      Experience Level *
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category & Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag size={16} className="inline mr-1" />
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Software Development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Technology, Healthcare, Finance"
                    />
                  </div>

                  {/* Vacancies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} className="inline mr-1" />
                      Number of Vacancies
                    </label>
                    <input
                      type="number"
                      name="vacancies"
                      value={formData.vacancies}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Application Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.applicationDeadline ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                    {formErrors.applicationDeadline && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.applicationDeadline}</p>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={8}
                    className={`w-full px-3 py-2 border ${
                      formErrors.description ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Describe the job responsibilities, qualifications, company culture, and what you're looking for in a candidate..."
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>
              </section>

              {/* 🔥 SECTION 3: SALARY INFORMATION */}
              <section className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="text-green-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">Salary & Compensation</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Amount
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. 80,000 - 100,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Type
                    </label>
                    <select
                      name="salaryType"
                      value={formData.salaryType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {salaryTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="salaryCurrency"
                      value={formData.salaryCurrency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {currencies.map(currency => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    name="showSalary"
                    checked={formData.showSalary}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Show salary in job posting
                  </label>
                </div>
              </section>

              {/* 🔥 SECTION 4: REQUIREMENTS & QUALIFICATIONS */}
              <section className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FileText className="text-purple-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">Requirements & Qualifications</h3>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements (comma separated) *
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                    rows={4}
                    className={`w-full px-3 py-2 border ${
                      formErrors.requirements ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="e.g. JavaScript, React, Node.js, 3+ years experience, Bachelor's degree in Computer Science"
                  />
                  {formErrors.requirements && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.requirements}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  {renderArrayInput('skills', currentSkill, setCurrentSkill, 'Add a skill...', '💡')}
                </div>

                {/* Education & Certifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Requirements
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Bachelor's degree in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    <input
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. AWS Certified, PMP, etc."
                    />
                  </div>
                </div>
              </section>

              {/* 🔥 SECTION 5: BENEFITS & PERKS */}
              <section className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">Benefits & Perks</h3>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Describe the benefits package (health insurance, retirement plans, etc.)"
                  />
                </div>

                {/* Perks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perks
                  </label>
                  {renderArrayInput('perks', currentPerk, setCurrentPerk, 'Add a perk...', '🎁')}
                </div>
              </section>

              {/* 🔥 SECTION 6: APPLICATION & CONTACT */}
              <section className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">Application Process & Contact</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Application Instructions */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Instructions
                    </label>
                    <textarea
                      name="applicationInstructions"
                      value={formData.applicationInstructions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Provide specific instructions for applicants..."
                    />
                  </div>

                  {/* Application URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="applicationUrl"
                      value={formData.applicationUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Contact Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </section>

              {/* 🔥 SECTION 7: ADDITIONAL OPTIONS */}
              <section className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Tag className="text-orange-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">Additional Options</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Tags */}
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    {renderArrayInput('tags', currentTag, setCurrentTag, 'Add a tag...', '🏷️')}
                  </div>

                  {/* Job Flags */}
                  <div className="space-y-4 lg:col-span-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="urgent"
                        checked={formData.urgent}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Mark as Urgent Hiring
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Feature this Job
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* 🔥 SUBMIT BUTTONS */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.company}
                  className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {(isSubmitting || loading.general) && (
                    <Loader size={16} className="animate-spin mr-2" />
                  )}
                  {job ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default JobForm;