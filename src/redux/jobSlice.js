// FRONTEND/src/redux/jobSlice.js
// 🎯 UPDATED VERSION - Complete with all features

import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    allAppliedJobs: [],
    savedJobs: [], // ✅ ADDED: For tracking saved jobs
    viewMode: "grid", // ✅ ADDED: For grid/list view (default: grid)
    loading: false, // ✅ ADDED: For loading state
    error: null, // ✅ ADDED: For error state
    searchHistory: [], // ✅ ADDED: For AI search suggestions
    recentViews: [], // ✅ ADDED: For recently viewed jobs
    filters: {
      searchText: "",
      location: [], // ✅ CHANGED: Now array for multiple selections
      industry: [], // ✅ CHANGED: Now array for multiple selections
      salary: "", // string
      company: [], // ✅ CHANGED: Now array for multiple selections
      experiencelevel: [], // ✅ CHANGED: Now array for multiple selections
      jobtype: [], // array
      skills: [], // array
      benefits: [], // array
      salaryrange: [], // array
      remoteOnly: false, // ✅ ADDED: Remote filter
      easyApply: false, // ✅ ADDED: Easy apply filter
      datePosted: "all", // ✅ ADDED: Date filter (all, 24h, 7d, 30d)
      sortBy: "recent", // ✅ ADDED: Sorting (recent, salary_high, salary_low, relevant)
      aiRelevance: true, // ✅ ADDED: AI relevance sorting
    },
  },
  reducers: {
    // 🎯 Job-related reducers
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },

    // 🎯 NEW: Saved jobs management
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },
    toggleSavedJob: (state, action) => {
      const { jobId, saved } = action.payload;
      if (saved && !state.savedJobs.includes(jobId)) {
        state.savedJobs.push(jobId);
      } else if (!saved) {
        state.savedJobs = state.savedJobs.filter(id => id !== jobId);
      }
    },
    addToSavedJobs: (state, action) => {
      const jobId = action.payload;
      if (!state.savedJobs.includes(jobId)) {
        state.savedJobs.push(jobId);
      }
    },
    removeFromSavedJobs: (state, action) => {
      const jobId = action.payload;
      state.savedJobs = state.savedJobs.filter(id => id !== jobId);
    },
    clearSavedJobs: (state) => {
      state.savedJobs = [];
    },

    // 🎯 NEW: View mode management
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === "grid" ? "list" : "grid";
    },

    // 🎯 NEW: Loading & error states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // 🎯 NEW: Search history & analytics
    addToSearchHistory: (state, action) => {
      const searchTerm = action.payload;
      // Remove if already exists
      state.searchHistory = state.searchHistory.filter(term => term !== searchTerm);
      // Add to beginning
      state.searchHistory.unshift(searchTerm);
      // Keep only last 10 searches
      if (state.searchHistory.length > 10) {
        state.searchHistory.pop();
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    addToRecentViews: (state, action) => {
      const jobId = action.payload;
      // Remove if already exists
      state.recentViews = state.recentViews.filter(id => id !== jobId);
      // Add to beginning
      state.recentViews.unshift(jobId);
      // Keep only last 20 views
      if (state.recentViews.length > 20) {
        state.recentViews.pop();
      }
    },
    clearRecentViews: (state) => {
      state.recentViews = [];
    },

    // 🎯 Specific filter setters (UPDATED for arrays)
    setSearchText: (state, action) => {
      state.filters.searchText = action.payload;
    },
    setLocationFilter: (state, action) => {
      state.filters.location = action.payload;
    },
    setIndustryFilter: (state, action) => {
      state.filters.industry = action.payload;
    },
    setSalaryFilter: (state, action) => {
      state.filters.salary = action.payload;
    },
    setCompanyFilter: (state, action) => {
      state.filters.company = action.payload;
    },
    setExperienceLevelFilter: (state, action) => {
      state.filters.experiencelevel = action.payload;
    },
    setJobTypeFilter: (state, action) => {
      state.filters.jobtype = action.payload;
    },
    setSkillsFilter: (state, action) => {
      state.filters.skills = action.payload;
    },
    setBenefitsFilter: (state, action) => {
      state.filters.benefits = action.payload;
    },
    setSalaryRangeFilter: (state, action) => {
      state.filters.salaryrange = action.payload;
    },

    // 🎯 NEW: Advanced filter setters
    setRemoteOnlyFilter: (state, action) => {
      state.filters.remoteOnly = action.payload;
    },
    setEasyApplyFilter: (state, action) => {
      state.filters.easyApply = action.payload;
    },
    setDatePostedFilter: (state, action) => {
      state.filters.datePosted = action.payload;
    },
    setSortByFilter: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    setAiRelevanceFilter: (state, action) => {
      state.filters.aiRelevance = action.payload;
    },
    toggleRemoteOnlyFilter: (state) => {
      state.filters.remoteOnly = !state.filters.remoteOnly;
    },
    toggleEasyApplyFilter: (state) => {
      state.filters.easyApply = !state.filters.easyApply;
    },
    toggleAiRelevanceFilter: (state) => {
      state.filters.aiRelevance = !state.filters.aiRelevance;
    },

    // 🎯 Generic dynamic filter setter
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // 🎯 Clear all filters to initial state
    clearFilters: (state) => {
      state.filters = {
        searchText: "",
        location: [],
        industry: [],
        salary: "",
        company: [],
        experiencelevel: [],
        jobtype: [],
        skills: [],
        benefits: [],
        salaryrange: [],
        remoteOnly: false,
        easyApply: false,
        datePosted: "all",
        sortBy: "recent",
        aiRelevance: true,
      };
    },

    // 🎯 NEW: Reset entire state
    resetJobState: (state) => {
      state.allJobs = [];
      state.allAdminJobs = [];
      state.singleJob = null;
      state.allAppliedJobs = [];
      state.savedJobs = [];
      state.viewMode = "grid";
      state.loading = false;
      state.error = null;
      state.searchHistory = [];
      state.recentViews = [];
      state.filters = {
        searchText: "",
        location: [],
        industry: [],
        salary: "",
        company: [],
        experiencelevel: [],
        jobtype: [],
        skills: [],
        benefits: [],
        salaryrange: [],
        remoteOnly: false,
        easyApply: false,
        datePosted: "all",
        sortBy: "recent",
        aiRelevance: true,
      };
    },

    // 🎯 NEW: Batch operations
    batchSaveJobs: (state, action) => {
      const jobIds = action.payload;
      jobIds.forEach(jobId => {
        if (!state.savedJobs.includes(jobId)) {
          state.savedJobs.push(jobId);
        }
      });
    },
    batchUnsaveJobs: (state, action) => {
      const jobIds = action.payload;
      state.savedJobs = state.savedJobs.filter(id => !jobIds.includes(id));
    },

    // 🎯 NEW: AI-powered filtering
    applyAIFilters: (state, action) => {
      const { preferences } = action.payload;
      // AI would analyze preferences and adjust filters
      if (preferences.remote) {
        state.filters.remoteOnly = true;
      }
      if (preferences.highSalary) {
        state.filters.salaryrange = ["$100-150k", "$150-200k", "$200k+"];
      }
      if (preferences.tech) {
        state.filters.skills = ["javascript", "react", "node", "python"];
      }
    },
  },
});

// 🎯 Export all actions
export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setAllAppliedJobs,
  
  // Saved jobs
  setSavedJobs,
  toggleSavedJob,
  addToSavedJobs,
  removeFromSavedJobs,
  clearSavedJobs,
  
  // View mode
  setViewMode,
  toggleViewMode,
  
  // Loading & error
  setLoading,
  setError,
  clearError,
  
  // Search history
  addToSearchHistory,
  clearSearchHistory,
  addToRecentViews,
  clearRecentViews,
  
  // Basic filters
  setSearchText,
  setLocationFilter,
  setIndustryFilter,
  setSalaryFilter,
  setCompanyFilter,
  setExperienceLevelFilter,
  setJobTypeFilter,
  setSkillsFilter,
  setBenefitsFilter,
  setSalaryRangeFilter,
  
  // Advanced filters
  setRemoteOnlyFilter,
  setEasyApplyFilter,
  setDatePostedFilter,
  setSortByFilter,
  setAiRelevanceFilter,
  toggleRemoteOnlyFilter,
  toggleEasyApplyFilter,
  toggleAiRelevanceFilter,
  
  // Generic operations
  setFilters,
  clearFilters,
  resetJobState,
  
  // Batch operations
  batchSaveJobs,
  batchUnsaveJobs,
  
  // AI operations
  applyAIFilters,
} = jobSlice.actions;

// 🎯 Export selectors (useful for complex selections)
export const selectAllJobs = (state) => state.job.allJobs;
export const selectSavedJobs = (state) => state.job.savedJobs;
export const selectViewMode = (state) => state.job.viewMode;
export const selectFilters = (state) => state.job.filters;
export const selectLoading = (state) => state.job.loading;
export const selectError = (state) => state.job.error;
export const selectSearchHistory = (state) => state.job.searchHistory;
export const selectRecentViews = (state) => state.job.recentViews;

// 🎯 Export computed selectors
export const selectFilteredJobsCount = (state) => {
  const { allJobs, filters } = state.job;
  
  if (!allJobs.length) return 0;
  
  return allJobs.filter(job => {
    // Basic search text filter
    if (filters.searchText) {
      const query = filters.searchText.toLowerCase();
      const searchFields = [
        job.title,
        job.company?.name,
        job.description,
        job.skills?.join(' '),
        job.location
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchFields.includes(query)) return false;
    }
    
    // Remote filter
    if (filters.remoteOnly && !job.location?.toLowerCase().includes('remote')) {
      return false;
    }
    
    // Location filter (array)
    if (filters.location.length > 0) {
      const jobLocation = job.location?.toLowerCase() || '';
      if (!filters.location.some(loc => jobLocation.includes(loc.toLowerCase()))) {
        return false;
      }
    }
    
    // Skills filter (array)
    if (filters.skills.length > 0) {
      const jobSkills = job.skills?.map(s => s.toLowerCase()) || [];
      if (!filters.skills.some(skill => 
        jobSkills.some(js => js.includes(skill.toLowerCase()))
      )) {
        return false;
      }
    }
    
    return true;
  }).length;
};

// 🎯 Export default reducer
export default jobSlice.reducer;