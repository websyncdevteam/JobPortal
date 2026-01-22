// frontend/src/components/recruiter/QuickActionsToolbar.jsx
// QUICK ACTIONS TOOLBAR - PURE UI/UX ENHANCEMENT
// UI shortcuts to existing functions

import React from 'react';
import {
  Zap,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  Share2,
  Copy,
  Star,
  Clock,
  Calendar,
  Mail,
  MessageSquare,
  Users,
  Settings,
  RefreshCw,
  Bell,
  Bookmark,
  Eye,
  EyeOff
} from 'lucide-react';

const QuickActionsToolbar = ({ 
  onAction = () => {},
  currentView = 'jobs',
  showLabels = true
}) => {
  // Define actions based on current view
  const getActions = () => {
    const baseActions = [
      { id: 'refresh', label: 'Refresh', icon: RefreshCw, color: 'text-gray-600', shortcut: 'R' },
      { id: 'search', label: 'Search', icon: Search, color: 'text-blue-600', shortcut: 'F' },
      { id: 'filter', label: 'Filter', icon: Filter, color: 'text-purple-600', shortcut: 'L' },
    ];

    const viewSpecificActions = {
      jobs: [
        { id: 'new_job', label: 'New Job', icon: Plus, color: 'text-green-600', shortcut: 'J' },
        { id: 'export_jobs', label: 'Export', icon: Download, color: 'text-indigo-600', shortcut: 'E' },
        { id: 'print_jobs', label: 'Print', icon: Printer, color: 'text-gray-600', shortcut: 'P' },
      ],
      candidates: [
        { id: 'email_all', label: 'Email All', icon: Mail, color: 'text-blue-600', shortcut: 'M' },
        { id: 'schedule_interview', label: 'Schedule', icon: Calendar, color: 'text-amber-600', shortcut: 'I' },
        { id: 'export_candidates', label: 'Export', icon: Download, color: 'text-indigo-600', shortcut: 'E' },
      ],
      analytics: [
        { id: 'export_data', label: 'Export Data', icon: Download, color: 'text-indigo-600', shortcut: 'E' },
        { id: 'share_report', label: 'Share', icon: Share2, color: 'text-green-600', shortcut: 'S' },
        { id: 'save_report', label: 'Save', icon: Bookmark, color: 'text-yellow-600', shortcut: 'B' },
      ],
      interviews: [
        { id: 'new_interview', label: 'New Interview', icon: Plus, color: 'text-green-600', shortcut: 'I' },
        { id: 'send_reminders', label: 'Reminders', icon: Bell, color: 'text-red-600', shortcut: 'R' },
        { id: 'calendar_view', label: 'Calendar', icon: Calendar, color: 'text-purple-600', shortcut: 'C' },
      ]
    };

    return [...baseActions, ...(viewSpecificActions[currentView] || [])];
  };

  const actions = getActions();

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl/Cmd + key combinations
      if (e.ctrlKey || e.metaKey) {
        const action = actions.find(a => 
          a.shortcut && a.shorttingleCase() === e.key.toLowerCase()
        );
        if (action) {
          e.preventDefault();
          onAction(action.id);
        }
      }
      
      // Check for single key shortcuts (when focused on body)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement === document.body) {
        const action = actions.find(a => 
          a.shortcut && a.shorttingleCase() === e.key.toUpperCase()
        );
        if (action) {
          e.preventDefault();
          onAction(action.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [actions, onAction]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Zap className="text-amber-600 mr-3" size={20} />
          <div>
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">
              Keyboard shortcuts available: {actions.map(a => a.shortcut).join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onAction(action.id)}
                className="group relative p-4 bg-gray-50 hover:bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                {/* Keyboard shortcut badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.shortcut}
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`p-3 rounded-full bg-white border border-gray-300 group-hover:border-${action.color.split('-')[1]}-300 mb-3`}>
                    <Icon size={24} className={action.color} />
                  </div>
                  {showLabels && (
                    <span className="font-medium text-gray-900 text-sm text-center">
                      {action.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Advanced Actions */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Advanced Actions</span>
            <button className="text-xs text-indigo-600 hover:text-indigo-800">
              Customize →
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center">
              <Copy size={14} className="mr-2" />
              Duplicate View
            </button>
            <button className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors flex items-center">
              <Share2 size={14} className="mr-2" />
              Share View
            </button>
            <button className="px-3 py-1.5 text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors flex items-center">
              <Star size={14} className="mr-2" />
              Save as Preset
            </button>
            <button className="px-3 py-1.5 text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
              <Settings size={14} className="mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 pt-6 border-t">
          <details className="group">
            <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-700">
              <span>Keyboard Shortcuts</span>
              <ChevronDown className="ml-2 group-open:rotate-180 transition-transform" size={16} />
            </summary>
            <div className="mt-3 space-y-2">
              {actions.map(action => (
                <div key={action.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{action.label}</span>
                  <kbd className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300">
                    {action.shortcut}
                  </kbd>
                </div>
              ))}
              <div className="text-xs text-gray-500 mt-3">
                Press keys without modifier when no input is focused
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

// Add missing ChevronDown icon
const ChevronDown = ({ size = 16, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

export default QuickActionsToolbar;