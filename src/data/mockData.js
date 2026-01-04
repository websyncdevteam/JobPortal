// Mock data for local development
export const mockUsers = [
  {
    id: 1,
    email: "company@example.com",
    password: "password123",
    role: "company",
    company: {
      id: 1,
      name: "Tech Solutions Inc.",
      description: "A leading technology company",
      industry: "Information Technology"
    }
  },
  {
    id: 2,
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    company: null
  }
];

export const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer...",
    requirements: ["React", "JavaScript", "CSS"],
    location: "Remote",
    type: "full-time",
    companyId: 1,
    status: "active",
    createdAt: "2023-03-15"
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "We need an experienced Backend Developer...",
    requirements: ["Node.js", "Python", "SQL"],
    location: "New York, NY",
    type: "full-time",
    companyId: 1,
    status: "active",
    createdAt: "2023-03-10"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    description: "Join our design team as a UI/UX Designer...",
    requirements: ["Figma", "Sketch", "User Research"],
    location: "San Francisco, CA",
    type: "part-time",
    companyId: 1,
    status: "paused",
    createdAt: "2023-02-28"
  }
];

export const mockCandidates = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    jobId: 1,
    status: "interviewing",
    interviewStage: "interview-2",
    interviewDate: "2023-04-10",
    notes: [
      {
        note: "Strong React skills",
        createdBy: "Recruiter Jane",
        createdAt: "2023-03-20"
      }
    ],
    forwardedToCompany: true
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.j@example.com",
    phone: "555-987-6543",
    jobId: 1,
    status: "reviewed",
    interviewStage: "screening",
    interviewDate: null,
    notes: [
      {
        note: "Good portfolio, needs technical screening",
        createdBy: "Recruiter Mark",
        createdAt: "2023-03-22"
      }
    ],
    forwardedToCompany: false
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@example.com",
    phone: "555-456-7890",
    jobId: 2,
    status: "offered",
    interviewStage: "final-round",
    interviewDate: "2023-03-25",
    notes: [
      {
        note: "Excellent technical skills",
        createdBy: "Recruiter Sarah",
        createdAt: "2023-03-18"
      },
      {
        note: "Passed all technical rounds",
        createdBy: "Recruiter Sarah",
        createdAt: "2023-03-22"
      }
    ],
    forwardedToCompany: true
  }
];