// Mock data for the entire application
const mockUsers = [
  {
    id: 1,
    email: "company@example.com",
    password: "password123",
    role: "company",
    profile: {
      firstName: "John",
      lastName: "Doe",
      phone: "+1 (555) 123-4567",
      position: "HR Manager",
      department: "Human Resources"
    },
    company: {
      id: 1,
      name: "Tech Solutions Inc.",
      description: "A leading technology company specializing in software development",
      industry: "Information Technology",
      size: "101-500",
      website: "www.techsolutions.com",
      location: "San Francisco, CA",
      contact: {
        email: "info@techsolutions.com",
        phone: "+1 (555) 123-4567"
      }
    }
  },
  {
    id: 2,
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    profile: {
      firstName: "Admin",
      lastName: "User",
      phone: "+1 (555) 987-6543"
    }
  }
];

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer with experience in React and modern JavaScript frameworks.",
    requirements: ["React", "JavaScript", "CSS", "HTML5", "Redux"],
    location: "Remote",
    type: "full-time",
    salary: "$90,000 - $120,000",
    experience: "Mid-level",
    companyId: 1,
    status: "active",
    createdAt: "2023-03-15T10:30:00Z",
    createdBy: 1
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Join our backend team to build scalable APIs and services using Node.js and Python.",
    requirements: ["Node.js", "Python", "SQL", "REST APIs", "Docker"],
    location: "New York, NY",
    type: "full-time",
    salary: "$100,000 - $130,000",
    experience: "Senior",
    companyId: 1,
    status: "active",
    createdAt: "2023-03-10T14:20:00Z",
    createdBy: 1
  },
  {
    id: 3,
    title: "UX/UI Designer",
    description: "Create beautiful and intuitive user interfaces for our products.",
    requirements: ["Figma", "Sketch", "User Research", "Wireframing", "Prototyping"],
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$85,000 - $110,000",
    experience: "Mid-level",
    companyId: 1,
    status: "active",
    createdAt: "2023-02-28T09:15:00Z",
    createdBy: 1
  },
  {
    id: 4,
    title: "DevOps Engineer",
    description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines.",
    requirements: ["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform"],
    location: "Remote",
    type: "full-time",
    salary: "$110,000 - $140,000",
    experience: "Senior",
    companyId: 1,
    status: "paused",
    createdAt: "2023-02-20T11:45:00Z",
    createdBy: 1
  }
];

const mockCandidates = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    resume: "john_smith_resume.pdf",
    jobId: 1,
    status: "interviewing",
    interviewStage: "interview-2",
    interviewDate: "2023-04-10T14:00:00Z",
    applicationDate: "2023-03-20T09:30:00Z",
    notes: [
      {
        id: 1,
        note: "Strong React skills and good portfolio",
        createdBy: "Recruiter Jane",
        createdAt: "2023-03-22T11:20:00Z"
      },
      {
        id: 2,
        note: "Passed technical screening with flying colors",
        createdBy: "Technical Lead Mike",
        createdAt: "2023-03-25T15:40:00Z"
      }
    ],
    skills: ["React", "JavaScript", "CSS", "TypeScript", "Redux"],
    education: "BS in Computer Science, Stanford University",
    experience: "3 years at TechCorp as Frontend Developer",
    recruiter: 1,
    forwardedToCompany: true,
    updatedAt: "2023-03-28T10:15:00Z"
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.j@example.com",
    phone: "555-987-6543",
    resume: "emily_johnson_resume.pdf",
    jobId: 1,
    status: "reviewed",
    interviewStage: "screening",
    applicationDate: "2023-03-22T14:20:00Z",
    notes: [
      {
        id: 3,
        note: "Good portfolio, needs technical screening",
        createdBy: "Recruiter Mark",
        createdAt: "2023-03-23T16:30:00Z"
      }
    ],
    skills: ["React", "JavaScript", "HTML", "CSS", "SASS"],
    education: "BA in Design, UCLA",
    experience: "2 years as UI Developer at DesignHub",
    recruiter: 2,
    forwardedToCompany: false,
    updatedAt: "2023-03-23T16:30:00Z"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@example.com",
    phone: "555-456-7890",
    resume: "michael_brown_resume.pdf",
    jobId: 2,
    status: "offered",
    interviewStage: "final-round",
    interviewDate: "2023-03-25T10:00:00Z",
    applicationDate: "2023-03-15T11:45:00Z",
    notes: [
      {
        id: 4,
        note: "Excellent technical skills and cultural fit",
        createdBy: "Recruiter Sarah",
        createdAt: "2023-03-18T14:20:00Z"
      },
      {
        id: 5,
        note: "Passed all technical rounds with excellent feedback",
        createdBy: "Technical Lead Alex",
        createdAt: "2023-03-22T16:45:00Z"
      }
    ],
    skills: ["Node.js", "Python", "SQL", "MongoDB", "AWS"],
    education: "MS in Computer Science, MIT",
    experience: "5 years as Backend Engineer at DataSystems",
    recruiter: 3,
    forwardedToCompany: true,
    updatedAt: "2023-03-28T09:30:00Z"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "s.wilson@example.com",
    phone: "555-321-0987",
    resume: "sarah_wilson_resume.pdf",
    jobId: 3,
    status: "hired",
    interviewStage: "completed",
    interviewDate: "2023-03-20T13:30:00Z",
    applicationDate: "2023-03-05T10:15:00Z",
    notes: [
      {
        id: 6,
        note: "Exceptional design portfolio and user research skills",
        createdBy: "Design Lead Lisa",
        createdAt: "2023-03-08T11:20:00Z"
      },
      {
        id: 7,
        note: "Accepted our offer, starting next month",
        createdBy: "HR Manager John",
        createdAt: "2023-03-22T15:30:00Z"
      }
    ],
    skills: ["Figma", "Sketch", "User Research", "Wireframing", "Prototyping"],
    education: "BFA in Design, RISD",
    experience: "4 years as Product Designer at CreativeMinds",
    recruiter: 1,
    forwardedToCompany: true,
    joiningDate: "2023-04-15T00:00:00Z",
    updatedAt: "2023-03-22T15:30:00Z"
  },
  {
    id: 5,
    name: "David Chen",
    email: "d.chen@example.com",
    phone: "555-654-3210",
    resume: "david_chen_resume.pdf",
    jobId: 2,
    status: "rejected",
    interviewStage: "interview-1",
    interviewDate: "2023-03-18T15:00:00Z",
    applicationDate: "2023-03-12T13:20:00Z",
    notes: [
      {
        id: 8,
        note: "Good technical skills but not enough experience with cloud technologies",
        createdBy: "Technical Lead Alex",
        createdAt: "2023-03-19T10:45:00Z"
      }
    ],
    skills: ["Node.js", "JavaScript", "SQL", "Express", "REST APIs"],
    education: "BS in Software Engineering, UC Berkeley",
    experience: "2 years as Junior Backend Developer at WebSolutions",
    recruiter: 2,
    forwardedToCompany: true,
    updatedAt: "2023-03-19T10:45:00Z"
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock stats based on time range
const generateStats = (jobs, candidates, timeRange) => {
  const now = new Date();
  let startDate;
  
  if (timeRange === 'week') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timeRange === 'month') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else {
    startDate = new Date(0); // All time
  }
  
  const recentCandidates = candidates.filter(c => new Date(c.applicationDate) >= startDate);
  const hiredCandidates = recentCandidates.filter(c => c.status === 'hired');
  const interviewingCandidates = recentCandidates.filter(c => 
    ['interviewing', 'offered'].includes(c.status)
  );
  
  return {
    totalCandidates: recentCandidates.length,
    hiredCandidates: hiredCandidates.length,
    interviewingCandidates: interviewingCandidates.length,
    openPositions: jobs.filter(j => j.status === 'active').length,
    conversionRate: recentCandidates.length > 0 
      ? (hiredCandidates.length / recentCandidates.length * 100).toFixed(1) 
      : 0,
  };
};

// Generate mock recent activity
const generateRecentActivity = (candidates) => {
  return candidates
    .filter(c => c.status === 'offered' || c.status === 'hired' || c.status === 'rejected')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map(candidate => ({
      id: candidate.id,
      type: candidate.status === 'hired' ? 'hired' : 
            candidate.status === 'offered' ? 'offer' : 
            candidate.status === 'rejected' ? 'rejected' : 'interview',
      candidateName: candidate.name,
      jobTitle: mockJobs.find(j => j.id === candidate.jobId)?.title || 'Unknown',
      date: candidate.updatedAt,
    }));
};

// Generate mock upcoming interviews
const generateUpcomingInterviews = (candidates) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return candidates
    .filter(c => c.interviewDate && new Date(c.interviewDate) >= tomorrow && new Date(c.interviewDate) <= nextWeek)
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 5)
    .map(candidate => ({
      id: candidate.id,
      candidateName: candidate.name,
      jobTitle: mockJobs.find(j => j.id === candidate.jobId)?.title || 'Unknown',
      interviewDate: candidate.interviewDate,
      interviewStage: candidate.interviewStage,
    }));
};

// Mock API calls for local development
export const authAPI = {
  login: async (email, password) => {
    await delay(500); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword, token: 'mock-jwt-token' };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  },
  
  getCurrentUser: async () => {
    await delay(300);
    // In a real app, this would validate the token and get user info
    return mockUsers[0]; // Return first user as logged in
  }
};

export const companyAPI = {
  getDashboardData: async (companyId, timeRange = 'week') => {
    await delay(600);
    
    const companyJobs = mockJobs.filter(job => job.companyId === companyId);
    const companyCandidates = mockCandidates.filter(c => 
      companyJobs.some(j => j.id === c.jobId)
    );
    
    const jobsWithCandidateCounts = companyJobs.map(job => {
      const candidates = mockCandidates.filter(c => c.jobId === job.id);
      const statusCounts = {};
      
      candidates.forEach(candidate => {
        statusCounts[candidate.status] = (statusCounts[candidate.status] || 0) + 1;
      });
      
      return {
        ...job,
        candidateCounts: statusCounts,
        totalCandidates: candidates.length
      };
    });
    
    return {
      company: mockUsers.find(u => u.company && u.company.id === companyId)?.company,
      jobs: jobsWithCandidateCounts,
      stats: generateStats(companyJobs, companyCandidates, timeRange),
      recentActivity: generateRecentActivity(companyCandidates),
      upcomingInterviews: generateUpcomingInterviews(companyCandidates)
    };
  },
  
  getJobCandidates: async (jobId, filters = {}) => {
    await delay(400);
    
    let candidates = mockCandidates.filter(c => c.jobId === parseInt(jobId));
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      candidates = candidates.filter(c => c.status === filters.status);
    }
    
    if (filters.stage && filters.stage !== 'all') {
      candidates = candidates.filter(c => c.interviewStage === filters.stage);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      candidates = candidates.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.email.toLowerCase().includes(searchTerm)
      );
    }
    
    return candidates;
  },addCandidateNote: async (candidateId, note) => {
  const candidate = mockCandidates.find(c => c.id === Number(candidateId));
  if (candidate) {
    candidate.notes.push({
      note,
      createdBy: "Recruiter", // replace with current user if needed
      createdAt: new Date().toISOString(),
    });
    return candidate;
  }
  return null;
},

scheduleInterview: async (candidateId, interviewDate, interviewStage) => {
  const candidate = mockCandidates.find(c => c.id === Number(candidateId));
  if (candidate) {
    candidate.interviewDate = interviewDate;
    candidate.interviewStage = interviewStage;
    return candidate;
  }
  return null;
},

  updateCandidateStatus: async (candidateId, newStatus) => {
  const candidateIndex = mockCandidates.findIndex(c => c.id === Number(candidateId));
  if (candidateIndex !== -1) {
    mockCandidates[candidateIndex].status = newStatus;
    return mockCandidates[candidateIndex];
  }
  return null;
},

  
  getCandidate: async (candidateId) => {
    await delay(300);
    const candidate = mockCandidates.find(c => c.id === parseInt(candidateId));
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    return candidate;
  },
  
  updateCandidateStatus: async (candidateId, status) => {
    await delay(300);
    const candidate = mockCandidates.find(c => c.id === parseInt(candidateId));
    if (candidate) {
      candidate.status = status;
      candidate.updatedAt = new Date().toISOString();
      return { success: true, candidate };
    }
    return { success: false, message: 'Candidate not found' };
  },
  
  updateCandidateStage: async (candidateId, stage) => {
    await delay(300);
    const candidate = mockCandidates.find(c => c.id === parseInt(candidateId));
    if (candidate) {
      candidate.interviewStage = stage;
      candidate.updatedAt = new Date().toISOString();
      return { success: true, candidate };
    }
    return { success: false, message: 'Candidate not found' };
  },
  
  scheduleInterview: async (candidateId, interviewDate) => {
    await delay(300);
    const candidate = mockCandidates.find(c => c.id === parseInt(candidateId));
    if (candidate) {
      candidate.interviewDate = interviewDate;
      candidate.updatedAt = new Date().toISOString();
      return { success: true, candidate };
    }
    return { success: false, message: 'Candidate not found' };
  },
  
  addCandidateNote: async (candidateId, note) => {
    await delay(300);
    const candidate = mockCandidates.find(c => c.id === parseInt(candidateId));
    if (candidate) {
      if (!candidate.notes) candidate.notes = [];
      const newNote = {
        id: Math.max(...candidate.notes.map(n => n.id), 0) + 1,
        note,
        createdBy: "Current User",
        createdAt: new Date().toISOString()
      };
      candidate.notes.push(newNote);
      candidate.updatedAt = new Date().toISOString();
      return { success: true, candidate, newNote };
    }
    return { success: false, message: 'Candidate not found' };
  },
  
  getAnalyticsData: async (companyId, timeRange = 'month') => {
    await delay(600);
    
    const companyJobs = mockJobs.filter(job => job.companyId === companyId);
    const companyCandidates = mockCandidates.filter(c => 
      companyJobs.some(j => j.id === c.jobId)
    );
    
    // Generate trends data
    const trends = [
      { month: 'Jan', applications: 65, interviews: 28, hires: 7 },
      { month: 'Feb', applications: 59, interviews: 25, hires: 6 },
      { month: 'Mar', applications: 80, interviews: 35, hires: 9 },
      { month: 'Apr', applications: 81, interviews: 37, hires: 8 },
      { month: 'May', applications: 56, interviews: 24, hires: 5 },
      { month: 'Jun', applications: 72, interviews: 32, hires: 7 },
    ];
    
    // Generate candidate sources data
    const candidateSources = [
      { name: 'LinkedIn', value: 35 },
      { name: 'Indeed', value: 25 },
      { name: 'Company Website', value: 20 },
      { name: 'Referrals', value: 12 },
      { name: 'Other', value: 8 },
    ];
    
    // Generate position performance data
    const positionPerformance = companyJobs.map(job => {
      const candidates = mockCandidates.filter(c => c.jobId === job.id);
      return {
        position: job.title,
        applicants: candidates.length,
        interviews: candidates.filter(c => c.interviewStage !== 'applied').length,
        hires: candidates.filter(c => c.status === 'hired').length
      };
    });
    
    // Generate skills distribution data
    const skillsDistribution = [
      { subject: 'JavaScript', A: 120, fullMark: 150 },
      { subject: 'React', A: 98, fullMark: 150 },
      { subject: 'Node.js', A: 86, fullMark: 150 },
      { subject: 'UI/UX', A: 99, fullMark: 150 },
      { subject: 'Communication', A: 85, fullMark: 150 },
      { subject: 'Problem Solving', A: 95, fullMark: 150 },
    ];
    
    return {
      overview: {
        totalCandidates: companyCandidates.length,
        hiredCandidates: companyCandidates.filter(c => c.status === 'hired').length,
        openPositions: companyJobs.filter(j => j.status === 'active').length,
        conversionRate: companyCandidates.length > 0 
          ? (companyCandidates.filter(c => c.status === 'hired').length / companyCandidates.length * 100).toFixed(1)
          : 0,
        avgTimeToHire: 34,
        candidateSatisfaction: 4.5,
      },
      trends,
      candidateSources,
      positionPerformance,
      skillsDistribution
    };
  },
  
  updateProfile: async (profileData) => {
    await delay(500);
    // In a real app, this would update the user's profile
    return { success: true, message: 'Profile updated successfully', profile: profileData };
  },
  
  updateCompany: async (companyData) => {
    await delay(500);
    // In a real app, this would update the company information
    return { success: true, message: 'Company information updated successfully', company: companyData };
  },
  
  updateNotifications: async (notificationSettings) => {
    await delay(500);
    // In a real app, this would update notification settings
    return { success: true, message: 'Notification settings updated successfully', notifications: notificationSettings };
  },
  
  updateSecurity: async (securitySettings) => {
    await delay(500);
    // In a real app, this would update security settings
    return { success: true, message: 'Security settings updated successfully', security: securitySettings };
  },
  
  updateAppearance: async (appearanceSettings) => {
    await delay(500);
    // In a real app, this would update appearance settings
    return { success: true, message: 'Appearance settings updated successfully', appearance: appearanceSettings };
  }
};
