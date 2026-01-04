import api from "./api"; // ✅ our central axios instance

const recruiterService = {
  // 🔹 Job Management
  createJob: async (jobData) => {
    const response = await api.post("/recruiter/jobs", jobData);
    return response.data;
  },

  getJobs: async () => {
    const response = await api.get("/recruiter/jobs");
    return response.data;
  },

  updateJobStatus: async (jobId, status) => {
    const response = await api.put(`/recruiter/jobs/${jobId}/status`, { status });
    return response.data;
  },

  // 🔹 Candidate Management
  getCandidates: async (jobId) => {
    const response = await api.get(`/recruiter/candidates/jobs/${jobId}/candidates`);
    return response.data;
  },

  updateCandidateStatus: async (applicationId, status) => {
    const response = await api.put(`/recruiter/candidates/${applicationId}/status`, { status });
    return response.data;
  },

  // 🔹 Interview Scheduling
  scheduleInterview: async (interviewData) => {
    const response = await api.post("/recruiter/interviews", interviewData);
    return response.data;
  },
};

export default recruiterService;
