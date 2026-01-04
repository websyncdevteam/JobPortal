import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, clearFilters } from "@/redux/jobSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Plus, Minus, Filter } from "lucide-react";

// Enhanced filter data with more categories and dynamic options
const generateFilterData = (allJobs) => {
  // Extract unique values from jobs data
  const locations = [...new Set(allJobs.map(job => job.location).filter(Boolean))].slice(0, 20);
  const companies = [...new Set(allJobs.map(job => job.company?.name).filter(Boolean))].slice(0, 15);
  const allSkills = allJobs.flatMap(job => job.skills || []).filter(Boolean);
  const uniqueSkills = [...new Set(allSkills)].slice(0, 25);
  
  // Count frequency for sorting
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});

  const sortedSkills = uniqueSkills.sort((a, b) => skillCounts[b] - skillCounts[a]);

  return [
    {
      filterType: "Location",
      array: locations.length > 0 ? locations : ["Remote", "Hybrid", "On-site", "New York", "San Francisco", "London", "Berlin", "Tokyo", "Bangalore", "Mumbai"],
      searchable: true,
      icon: "📍"
    },
    {
      filterType: "Company",
      array: companies.length > 0 ? companies : ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Twitter", "Uber"],
      searchable: true,
      icon: "🏢"
    },
    {
      filterType: "Salary Range",
      array: ["$0-50k", "$50-100k", "$100-150k", "$150-200k", "$200k+"],
      searchable: false,
      icon: "💰"
    },
    {
      filterType: "Experience Level",
      array: ["Intern", "Entry Level", "Mid Level", "Senior", "Lead", "Executive"],
      searchable: false,
      icon: "🎯"
    },
    {
      filterType: "Job Type",
      array: ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote"],
      searchable: false,
      icon: "⏰"
    },
    {
      filterType: "Skills",
      array: sortedSkills.length > 0 ? sortedSkills : ["React", "Node.js", "Python", "JavaScript", "TypeScript", "AWS", "Docker", "Kubernetes"],
      searchable: true,
      icon: "🛠️"
    },
    {
      filterType: "Industry",
      array: ["Technology", "Finance", "Healthcare", "Education", "E-commerce", "Marketing", "Design", "Sales", "Operations"],
      searchable: true,
      icon: "🏭"
    },
    {
      filterType: "Benefits",
      array: ["Health Insurance", "Remote Work", "Flexible Hours", "Stock Options", "Unlimited PTO", "Learning Budget", "Gym Membership", "Free Food"],
      searchable: true,
      icon: "🎁"
    }
  ];
};

// Custom hook for managing filter state
const useFilterState = (filterType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showAll, setShowAll] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const clearSearch = () => setSearchInput("");

  return {
    isOpen,
    searchInput,
    showAll,
    toggleOpen,
    setSearchInput,
    setShowAll,
    clearSearch
  };
};

// Individual Filter Section Component
const FilterSection = ({ filter, selectedOptions, onToggle, filterState, totalItems, showItems }) => {
  const { filterType, array, searchable, icon } = filter;
  const { isOpen, searchInput, showAll, toggleOpen, setSearchInput, setShowAll, clearSearch } = filterState;

  const filteredOptions = useMemo(() => {
    let filtered = array.filter(option =>
      option.toLowerCase().includes(searchInput.toLowerCase())
    );
    
    if (!showAll && filtered.length > showItems) {
      filtered = filtered.slice(0, showItems);
    }
    
    return filtered;
  }, [array, searchInput, showAll, showItems]);

  const hasMoreItems = array.length > showItems;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <div className="text-left">
            <span className="font-semibold text-gray-900 block">{filterType}</span>
            <span className="text-sm text-gray-500">
              {selectedOptions.length > 0 
                ? `${selectedOptions.length} selected` 
                : `${array.length} options`
              }
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedOptions.length > 0 && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              {selectedOptions.length}
            </span>
          )}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600"
          >
            ▼
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white border-t border-gray-200">
              {/* Search Input */}
              {searchable && (
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={`Search ${filterType}`}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchInput && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Filter Options */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No {filterType.toLowerCase()} found
                  </p>
                ) : (
                  filteredOptions.map((item, index) => {
                    const isChecked = selectedOptions.includes(item);
                    const itemId = `filter-${filterType}-${item.replace(/\s+/g, "-")}-${index}`;

                    return (
                      <div
                        key={itemId}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                        onClick={() => onToggle(filterType, item)}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => onToggle(filterType, item)}
                          id={itemId}
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-colors"
                        />
                        <Label
                          htmlFor={itemId}
                          className={`flex-1 cursor-pointer font-medium transition-colors ${
                            isChecked ? "text-blue-600" : "text-gray-700"
                          } group-hover:text-blue-600`}
                        >
                          {item}
                        </Label>
                        {isChecked && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Show More/Less Button */}
              {hasMoreItems && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {showAll ? (
                      <>
                        <Minus className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Show More ({array.length - showItems} more)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterCard = () => {
  const dispatch = useDispatch();
  const { allJobs, filters } = useSelector((store) => store.job);
  
  // Generate dynamic filter data based on actual jobs
  const filterData = useMemo(() => generateFilterData(allJobs), [allJobs]);
  
  // Initialize filter states
  const filterStates = filterData.reduce((acc, filter) => {
    acc[filter.filterType] = useFilterState(filter.filterType);
    return acc;
  }, {});

  const [searchInputs, setSearchInputs] = useState({});

  // Initialize selected filters from Redux
  const selectedFilters = useMemo(() => {
    return filterData.reduce((acc, filter) => {
      const key = filter.filterType.toLowerCase().replace(/\s+/g, '');
      acc[filter.filterType] = filters[key] || [];
      return acc;
    }, {});
  }, [filterData, filters]);

  const toggleSelection = (filterType, value) => {
    const key = filterType.toLowerCase().replace(/\s+/g, '');
    const currentFilters = filters[key] || [];
    const isSelected = currentFilters.includes(value);
    
    const newFilters = {
      ...filters,
      [key]: isSelected
        ? currentFilters.filter((item) => item !== value)
        : [...currentFilters, value],
    };

    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    // Clear all filter states
    Object.values(filterStates).forEach(state => {
      state.clearSearch();
      state.setShowAll(false);
    });
  };

  const handleClearFilterType = (filterType) => {
    const key = filterType.toLowerCase().replace(/\s+/g, '');
    const newFilters = {
      ...filters,
      [key]: []
    };
    dispatch(setFilters(newFilters));
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => {
      return count + (Array.isArray(filterArray) ? filterArray.length : 0);
    }, 0);
  };

  const getTotalOptionsCount = () => {
    return filterData.reduce((count, filter) => count + filter.array.length, 0);
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
            <p className="text-sm text-gray-500">
              {getTotalOptionsCount()}+ options across {filterData.length} categories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={getActiveFilterCount() === 0}
            className="flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Quick Clear Sections */}
      {getActiveFilterCount() > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Active Filters:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterData.map((filter) => {
              const key = filter.filterType.toLowerCase().replace(/\s+/g, '');
              const selected = filters[key] || [];
              if (selected.length === 0) return null;
              
              return (
                <button
                  key={filter.filterType}
                  onClick={() => handleClearFilterType(filter.filterType)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
                >
                  {filter.filterType}: {selected.length}
                  <X className="w-3 h-3" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filterData.map((filter) => (
          <FilterSection
            key={filter.filterType}
            filter={filter}
            selectedOptions={selectedFilters[filter.filterType] || []}
            onToggle={toggleSelection}
            filterState={filterStates[filter.filterType]}
            totalItems={filter.array.length}
            showItems={8}
          />
        ))}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Total filters: {filterData.length} categories</span>
          <span>Options: {getTotalOptionsCount()}+</span>
        </div>
      </div>
    </div>
  );
};

export default FilterCard;