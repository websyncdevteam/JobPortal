// frontend/src/components/recruiter/AdvancedFilters.jsx
// ENHANCED FILTERING UI - PURE UI/UX ENHANCEMENT
// Works with existing filter logic, just better UI

import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sliders,
  Calendar,
  Award,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Star,
  Clock,
  Tag,
  RefreshCw,
  Save,
  Download,
  Upload
} from 'lucide-react';

const AdvancedFilters = ({ 
  onFilterChange, 
  initialFilters = {},
  availableSkills = [],
  availableLocations = [],
  availableJobTypes = []
}) => {
  const [filters, setFilters] = useState({
    status: initialFilters.status || [],
    experienceMin: initialFilters.experienceMin || '',
    experienceMax: initialFilters.experienceMax || '',
    salaryMin: initialFilters.salaryMin || '',
    salaryMax: initialFilters.salaryMax || '',
    location: initialFilters.location || [],
    jobType: initialFilters.jobType || [],
    skills: initialFilters.skills || [],
    education: initialFilters.education || [],
    dateApplied: initialFilters.dateApplied || '',
    keywords: initialFilters.keywords || '',
    tags: initialFilters.tags || [],
    isRemote: initialFilters.isRemote || false,
    isUrgent: initialFilters.isUrgent || false,
    isFeatured: initialFilters.isFeatured || false,
  });

  const [expandedSections, setExpandedSections] = useState({
    status: true,
    experience: true,
    location: true,
    skills: false,
    dates: false,
    advanced: false
  });

  const [savedPresets, setSavedPresets] = useState([
    { id: 1, name: 'Active Candidates', icon: '🔥' },
    { id: 2, name: 'Tech Positions', icon: '💻' },
    { id: 3, name: 'Senior Level', icon: '👔' },
    { id: 4, name: 'Remote Jobs', icon: '🏠' },
  ]);

  // Status options
  const statusOptions = [
    { value: 'new', label: 'New Applicants', color: 'bg-blue-100 text-blue-800' },
    { value: 'reviewed', label: 'Reviewed', color: 'bg-amber-100 text-amber-800' },
    { value: 'interview', label: 'Interview Stage', color: 'bg-purple-100 text-purple-800' },
    { value: 'hired', label: 'Hired', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-gray-100 text-gray-800' },
  ];

  // Education options
  const educationOptions = [
    { value: 'high_school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD' },
    { value: 'other', label: 'Other' },
  ];

  // Job type options
  const jobTypeOptions = availableJobTypes.length > 0 ? availableJobTypes : [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle array-based filters (multi-select)
  const handleArrayFilterChange = (key, value) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleFilterChange(key, newValues);
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = {
      status: [],
      experienceMin: '',
      experienceMax: '',
      salaryMin: '',
      salaryMax: '',
      location: [],
      jobType: [],
      skills: [],
      education: [],
      dateApplied: '',
      keywords: '',
      tags: [],
      isRemote: false,
      isUrgent: false,
      isFeatured: false,
    };
    
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Save current filter preset
  const handleSavePreset = () => {
    const presetName = prompt('Enter a name for this filter preset:');
    if (presetName) {
      const newPreset = {
        id: savedPresets.length + 1,
        name: presetName,
        icon: '⭐',
        filters: { ...filters }
      };
      setSavedPresets([...savedPresets, newPreset]);
      alert(`Preset "${presetName}" saved successfully!`);
    }
  };

  // Load filter preset
  const handleLoadPreset = (presetFilters) => {
    setFilters(presetFilters);
    onFilterChange(presetFilters);
  };

  // Export filters
  const handleExportFilters = () => {
    const filtersJson = JSON.stringify(filters, null, 2);
    const blob = new Blob([filtersJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filters-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Count active filters
  const activeFilterCount = Object.keys(filters).reduce((count, key) => {
    const value = filters[key];
    if (Array.isArray(value)) {
      return count + value.length;
    } else if (typeof value === 'string' && value.trim() !== '') {
      return count + 1;
    } else if (typeof value === 'boolean' && value) {
      return count + 1;
    } else if (typeof value === 'number' && value > 0) {
      return count + 1;
    }
    return count;
  }, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Filter className="text-indigo-600 mr-3" size={20} />
          <div>
            <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
            <p className="text-sm text-gray-500">
              {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleSavePreset}
            className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors flex items-center"
          >
            <Save size={14} className="mr-1" />
            Save
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Quick Presets</p>
          <button
            onClick={handleExportFilters}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            <Download size={12} className="mr-1" />
            Export
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {savedPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => preset.filters && handleLoadPreset(preset.filters)}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <span className="mr-2">{preset.icon}</span>
              {preset.name}
            </button>
          ))}
          <button className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            <Upload size={14} className="mr-1" />
            Import
          </button>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-gray-200">
        {/* Status Filter */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('status')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                <Sliders size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Candidate Status</p>
                <p className="text-sm text-gray-500">Filter by application stage</p>
              </div>
            </div>
            {expandedSections.status ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.status && (
            <div className="mt-4 space-y-2">
              {statusOptions.map(option => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(option.value)}
                    onChange={() => handleArrayFilterChange('status', option.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${option.color}`}>
                    {option.value}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Experience & Salary */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('experience')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mr-3">
                <Award size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Experience & Salary</p>
                <p className="text-sm text-gray-500">Filter by years and compensation</p>
              </div>
            </div>
            {expandedSections.experience ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.experience && (
            <div className="mt-4 space-y-4">
              {/* Experience Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase size={14} className="inline mr-1" />
                  Experience (years)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={filters.experienceMin}
                      onChange={(e) => handleFilterChange('experienceMin', e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={filters.experienceMax}
                      onChange={(e) => handleFilterChange('experienceMax', e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={14} className="inline mr-1" />
                  Salary Range ($)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      min="0"
                      value={filters.salaryMin}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                      placeholder="Min salary"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      value={filters.salaryMax}
                      onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                      placeholder="Max salary"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location & Job Type */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                <MapPin size={16} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Location & Job Type</p>
                <p className="text-sm text-gray-500">Filter by work location and type</p>
              </div>
            </div>
            {expandedSections.location ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.location && (
            <div className="mt-4 space-y-4">
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {jobTypeOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleArrayFilterChange('jobType', option.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filters.jobType.includes(option.value)
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remote Work */}
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isRemote}
                    onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Remote positions only</span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isUrgent}
                    onChange={(e) => handleFilterChange('isUrgent', e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Urgent hiring positions</span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isFeatured}
                    onChange={(e) => handleFilterChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Featured jobs only</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Skills & Education */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('skills')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-3">
                <Star size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Skills & Education</p>
                <p className="text-sm text-gray-500">Filter by qualifications</p>
              </div>
            </div>
            {expandedSections.skills ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.skills && (
            <div className="mt-4 space-y-4">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.slice(0, 10).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleArrayFilterChange('skills', skill)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filters.skills.includes(skill)
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                  {availableSkills.length > 10 && (
                    <span className="text-xs text-gray-500 self-center">
                      +{availableSkills.length - 10} more
                    </span>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap size={14} className="inline mr-1" />
                  Education Level
                </label>
                <div className="space-y-2">
                  {educationOptions.map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.education.includes(option.value)}
                        onChange={() => handleArrayFilterChange('education', option.value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Date & Keywords */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('dates')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                <Calendar size={16} className="text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Date & Keywords</p>
                <p className="text-sm text-gray-500">Filter by time and search terms</p>
              </div>
            </div>
            {expandedSections.dates ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.dates && (
            <div className="mt-4 space-y-4">
              {/* Application Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Date
                </label>
                <select
                  value={filters.dateApplied}
                  onChange={(e) => handleFilterChange('dateApplied', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="3months">Last 3 months</option>
                  <option value="year">This year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords Search
                </label>
                <input
                  type="text"
                  value={filters.keywords}
                  onChange={(e) => handleFilterChange('keywords', e.target.value)}
                  placeholder="Search in resumes, notes, etc..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple keywords with commas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Active Filters</p>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Clear all
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.status.map(status => {
              const option = statusOptions.find(opt => opt.value === status);
              return (
                <span key={status} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Status: {option?.label || status}
                  <button
                    onClick={() => handleArrayFilterChange('status', status)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              );
            })}
            
            {(filters.experienceMin || filters.experienceMax) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                Exp: {filters.experienceMin || '0'}-{filters.experienceMax || '∞'} years
                <button
                  onClick={() => {
                    handleFilterChange('experienceMin', '');
                    handleFilterChange('experienceMax', '');
                  }}
                  className="ml-1 text-amber-600 hover:text-amber-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.isRemote && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Remote Only
                <button
                  onClick={() => handleFilterChange('isRemote', false)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.skills.slice(0, 3).map(skill => (
              <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Skill: {skill}
                <button
                  onClick={() => handleArrayFilterChange('skills', skill)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
            
            {filters.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                +{filters.skills.length - 3} more skills
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={handleClearAll}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
        <button
          onClick={() => onFilterChange(filters)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Filter size={16} className="mr-2" />
          Apply Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-white text-indigo-600 text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;