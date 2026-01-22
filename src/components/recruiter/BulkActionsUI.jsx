// frontend/src/components/recruiter/BulkActionsUI.jsx
// BULK ACTIONS UI - PURE UI/UX ENHANCEMENT
// Provides interface for batch operations on existing data

import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Mail,
  MessageSquare,
  Tag,
  Calendar,
  Download,
  Printer,
  Archive,
  Trash2,
  Copy,
  Share2,
  Filter,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  Loader,
  Users,
  Send,
  Clock,
  Star
} from 'lucide-react';

const BulkActionsUI = ({
  items = [],
  selectedItems = [],
  onSelectAll = () => {},
  onSelectItem = () => {},
  onBulkAction = () => {},
  availableActions = [
    { id: 'email', label: 'Send Email', icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'message', label: 'Send Message', icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'tag', label: 'Add Tags', icon: Tag, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'schedule', label: 'Schedule Interview', icon: Calendar, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { id: 'export', label: 'Export Data', icon: Download, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'print', label: 'Print', icon: Printer, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    { id: 'archive', label: 'Archive', icon: Archive, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'delete', label: 'Delete', icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-50' },
  ],
  isLoading = false
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [customTags, setCustomTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('default');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Email templates
  const emailTemplates = [
    { id: 'default', name: 'Default Follow-up', subject: 'Follow-up on your application', preview: 'Thank you for applying...' },
    { id: 'interview', name: 'Interview Invitation', subject: 'Interview Invitation', preview: 'We would like to invite you...' },
    { id: 'rejection', name: 'Application Update', subject: 'Update on your application', preview: 'Thank you for your interest...' },
    { id: 'offer', name: 'Job Offer', subject: 'Job Offer Letter', preview: 'We are pleased to offer you...' },
  ];

  // Predefined tags
  const predefinedTags = [
    { id: 1, name: 'Technical', color: 'bg-blue-100 text-blue-800' },
    { id: 2, name: 'Senior', color: 'bg-purple-100 text-purple-800' },
    { id: 3, name: 'Remote', color: 'bg-green-100 text-green-800' },
    { id: 4, name: 'Urgent', color: 'bg-red-100 text-red-800' },
    { id: 5, name: 'Follow-up', color: 'bg-yellow-100 text-yellow-800' },
    { id: 6, name: 'Top Candidate', color: 'bg-indigo-100 text-indigo-800' },
  ];

  // Handle select all
  const handleSelectAll = () => {
    onSelectAll(selectedItems.length === items.length ? [] : items.map(item => item.id || item._id));
  };

  // Handle individual select
  const handleSelectItem = (itemId) => {
    onSelectItem(itemId);
  };

  // Handle bulk action
  const handleActionClick = (actionId) => {
    setSelectedAction(actionId);
    
    switch (actionId) {
      case 'tag':
        setShowTagModal(true);
        break;
      case 'email':
        setShowEmailModal(true);
        break;
      case 'schedule':
        // Trigger existing schedule interview flow
        console.log('Bulk schedule interview for:', selectedItems.length, 'candidates');
        onBulkAction('schedule', selectedItems);
        break;
      case 'export':
        // Trigger existing export flow
        console.log('Bulk export for:', selectedItems.length, 'items');
        onBulkAction('export', selectedItems);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
          onBulkAction('delete', selectedItems);
        }
        break;
      default:
        onBulkAction(actionId, selectedItems);
    }
    
    setShowActions(false);
  };

  // Handle tag add
  const handleAddTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle apply tags
  const handleApplyTags = (tags) => {
    console.log('Applying tags:', tags, 'to items:', selectedItems);
    onBulkAction('tag', { items: selectedItems, tags });
    setShowTagModal(false);
    setCustomTags([]);
  };

  // Handle send email
  const handleSendEmail = () => {
    console.log('Sending email to:', selectedItems.length, 'candidates');
    console.log('Template:', emailTemplate);
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);
    
    onBulkAction('email', {
      items: selectedItems,
      template: emailTemplate,
      subject: emailSubject,
      body: emailBody
    });
    
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailBody('');
  };

  // Get selected items info
  const selectedItemsInfo = items.filter(item => 
    selectedItems.includes(item.id || item._id)
  );

  // Count by status
  const statusCounts = selectedItemsInfo.reduce((acc, item) => {
    const status = item.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className={`sticky top-0 z-10 transition-all duration-200 ${selectedItems.length > 0 ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`}>
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Left side: Selection info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {selectedItems.length === items.length ? (
                  <button
                    onClick={handleSelectAll}
                    className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Deselect all"
                  >
                    <CheckSquare size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSelectAll}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    title="Select all"
                  >
                    <Square size={20} />
                  </button>
                )}
                <span className="ml-2 font-medium text-gray-900">
                  {selectedItems.length} selected
                </span>
              </div>

              {/* Status breakdown */}
              <div className="hidden md:flex items-center space-x-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <span key={status} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {status}: {count}
                  </span>
                ))}
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowActions(!showActions)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <span>Actions</span>
                <MoreVertical size={16} className="ml-2" />
              </button>

              <button
                onClick={() => onSelectAll([])}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Quick Actions Bar */}
          {selectedItems.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {availableActions.slice(0, 6).map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center whitespace-nowrap ${action.bgColor} ${action.color} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <action.icon size={14} className="mr-2" />
                    {action.label}
                  </button>
                ))}
                <button
                  onClick={() => setShowActions(true)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center whitespace-nowrap"
                >
                  <MoreVertical size={14} className="mr-2" />
                  More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Actions Dropdown */}
      {showActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Bulk Actions ({selectedItems.length} selected)
              </h3>
              <button
                onClick={() => setShowActions(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 flex flex-col items-center justify-center text-center"
                  >
                    <div className={`p-3 rounded-full ${action.bgColor} mb-3`}>
                      <action.icon size={24} className={action.color} />
                    </div>
                    <span className="font-medium text-gray-900">{action.label}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {action.id === 'email' && 'Send email to selected'}
                      {action.id === 'message' && 'Send message to selected'}
                      {action.id === 'tag' && 'Add tags to selected'}
                      {action.id === 'schedule' && 'Schedule interviews'}
                      {action.id === 'export' && 'Export selected data'}
                      {action.id === 'print' && 'Print selected items'}
                      {action.id === 'archive' && 'Archive selected items'}
                      {action.id === 'delete' && 'Delete selected items'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-between">
              <div className="text-sm text-gray-600">
                <Users size={14} className="inline mr-1" />
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </div>
              <button
                onClick={() => setShowActions(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Tags to {selectedItems.length} Items
              </h3>
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setCustomTags([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Predefined Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleApplyTags([tag.name])}
                      className={`px-3 py-1.5 rounded-full text-sm ${tag.color} hover:opacity-90 transition-opacity`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Custom Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Enter new tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {customTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {tag}
                        <button
                          onClick={() => setCustomTags(customTags.filter((_, i) => i !== index))}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Combined Tags */}
              {(predefinedTags.length > 0 || customTags.length > 0) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Apply all selected tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...predefinedTags.map(t => t.name), ...customTags].map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setCustomTags([]);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyTags([...predefinedTags.map(t => t.name), ...customTags])}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Tag size={16} className="mr-2" />
                Apply Tags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Send Email to {selectedItems.length} Candidates
              </h3>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailSubject('');
                  setEmailBody('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Email Template
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {emailTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setEmailTemplate(template.id);
                        setEmailSubject(template.subject);
                        setEmailBody(template.preview);
                      }}
                      className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                        emailTemplate === template.id
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{template.name}</span>
                        {emailTemplate === template.id && (
                          <Check size={16} className="text-indigo-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-1">{template.subject}</p>
                      <p className="text-xs text-gray-500 truncate">{template.preview}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Email subject..."
                />
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Body
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Write your email message here..."
                />
                <div className="mt-2 text-xs text-gray-500">
                  <p>Available variables: {`{candidate_name}` `{job_title}` `{company_name}`}</p>
                </div>
              </div>

              {/* Recipient Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Recipients ({selectedItems.length})</span>
                  <button
                    onClick={() => {
                      const emails = selectedItemsInfo.map(item => item.email).filter(Boolean).join(', ');
                      navigator.clipboard.writeText(emails);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <Copy size={12} className="mr-1" />
                    Copy emails
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {selectedItemsInfo.slice(0, 10).map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 py-1 border-b border-gray-200 last:border-0">
                      {item.name} &lt;{item.email}&gt;
                    </div>
                  ))}
                  {selectedItems.length > 10 && (
                    <div className="text-sm text-gray-500 py-1">
                      ...and {selectedItems.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailSubject('');
                  setEmailBody('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Send size={16} className="mr-2" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center">
            <Loader className="animate-spin text-indigo-600 mb-4" size={32} />
            <p className="text-gray-700">Processing bulk action...</p>
            <p className="text-sm text-gray-500 mt-1">
              This may take a moment for {selectedItems.length} items
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsUI;
