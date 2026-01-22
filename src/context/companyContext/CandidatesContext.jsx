import React, { createContext, useContext, useState, useEffect } from 'react';
import { companyAPI } from '../../services/companyservice/mockapi';
// ✅ CHANGE: Import from MAIN auth context
import { useAuth } from '../authContext';

const CandidatesContext = createContext();
export const useCandidates = () => useContext(CandidatesContext);

export const CandidatesProvider = ({ children }) => {
  // Get auth from MAIN context
  const auth = useAuth();
  
  console.log('🔍 [CandidatesProvider] Auth from MAIN context:', {
    exists: !!auth,
    user: auth?.user,
    loading: auth?.loading,
    isAuthenticated: auth?.isAuthenticated
  });
  
  // Handle all possible auth states
  if (auth === null || auth === undefined) {
    return <div>Initializing authentication...</div>;
  }
  
  if (auth.loading) {
    return <div>Loading user authentication...</div>;
  }
  
  // MAIN context uses 'user' property
  const { user } = auth;
  
  if (!user) {
    return (
      <div style={{ 
        padding: 40, 
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        margin: 20
      }}>
        <h3 style={{ color: '#64748b', marginBottom: 16 }}>
          Please login to access candidates
        </h3>
        <a 
          href="/company/login" 
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 6,
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Go to Login
        </a>
      </div>
    );
  }
  
  // Check if user is company or admin
  if (user.role !== 'company' && user.role !== 'admin') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h3 style={{ color: '#dc2626' }}>Access Denied</h3>
        <p>Only company users and admins can access this page.</p>
        <p>Your role: <strong>{user.role}</strong></p>
      </div>
    );
  }
  
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, use mock data
    const mockCandidates = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        jobTitle: 'Software Engineer',
        jobId: 'job1',
        status: 'pending',
        appliedDate: '2025-12-01',
        skills: ['React', 'Node.js', 'JavaScript']
      }
    ];
    
    setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 500);
    
  }, [user]);

  // Update status
  const updateCandidateStatus = (id, newStatus) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
    return Promise.resolve(true);
  };

  // Add note
  const addNote = (id, note) => {
    setCandidates(prev =>
      prev.map(c => 
        c.id === id 
          ? { ...c, notes: [...(c.notes || []), { text: note, date: new Date().toISOString() }] } 
          : c
      )
    );
    return Promise.resolve(true);
  };

  // Schedule interview
  const scheduleInterview = (id, interviewDate, interviewStage) => {
    setCandidates(prev =>
      prev.map(c =>
        c.id === id
          ? { 
              ...c, 
              interviewDate, 
              interviewStage,
              status: 'interview_scheduled'
            }
          : c
      )
    );
    return Promise.resolve(true);
  };

  const value = {
    candidates, 
    setCandidates, 
    loading, 
    error,
    updateCandidateStatus, 
    addNote, 
    scheduleInterview
  };

  return (
    <CandidatesContext.Provider value={value}>
      {children}
    </CandidatesContext.Provider>
  );
};  