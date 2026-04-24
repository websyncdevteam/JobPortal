import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../../context/companyContext/CandidatesContext';
import LoadingSpinner from './common/LoadingSpinner';
import api from '../../services/api';
import { toast } from 'sonner';
import { Download, Person, Email, Phone, Work, School, LocationOn, Description } from '@mui/icons-material';

const pipelineStages = ["applied", "reviewed", "interviewing", "offered", "hired", "rejected"];

const Candidates = () => {
  const { candidates, loading, updateCandidateStatus } = useCandidates();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [pushedCandidates, setPushedCandidates] = useState([]);
  const [loadingPushed, setLoadingPushed] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch pushed candidates
  const fetchPushedCandidates = async () => {
    setLoadingPushed(true);
    try {
      const res = await api.get('/company/workflow/pushed-candidates');
      setPushedCandidates(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch pushed candidates:', err);
      toast.error('Could not load pushed candidates');
    } finally {
      setLoadingPushed(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      fetchPushedCandidates();
    }
  }, [activeTab]);

  const filteredCandidates = candidates.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPushed = pushedCandidates.filter(c =>
    c.applicant?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'default';
      case 'reviewed': return 'primary';
      case 'interviewing': return 'info';
      case 'offered': return 'warning';
      case 'hired': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleNextStage = async (id, currentStatus) => {
    const currentIndex = pipelineStages.indexOf(currentStatus);
    const nextStage = pipelineStages[currentIndex + 1] || currentStatus;
    if (nextStage !== currentStatus) {
      await updateCandidateStatus(id, nextStage);
    }
  };

  const getResumeUrl = (resumePath) => {
    if (!resumePath) return '';
    if (resumePath.startsWith('http')) return resumePath;
    const baseURL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com/api/v1';
    return `${baseURL}${resumePath.startsWith('/') ? resumePath : `/${resumePath}`}`;
  };

  const openProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setProfileDialogOpen(true);
  };

  const CandidateProfileDialog = ({ candidate, onClose }) => {
    if (!candidate) return null;
    // Determine if it's a regular candidate (from applications) or pushed candidate
    const isPushed = !candidate.applicant; // pushed candidate has .applicant, regular has .name, .email, etc.
    const name = isPushed ? candidate.applicant?.fullname : candidate.name;
    const email = isPushed ? candidate.applicant?.email : candidate.email;
    const phone = isPushed ? candidate.applicant?.phoneNumber : candidate.phone;
    const jobTitle = isPushed ? candidate.job?.title : candidate.jobTitle;
    const skills = isPushed ? candidate.applicant?.profile?.skills || [] : candidate.skills || [];
    const experience = isPushed ? candidate.applicant?.profile?.experience : candidate.experience;
    const resume = isPushed ? candidate.applicant?.profile?.resume : candidate.resume;
    const profilePhoto = isPushed ? candidate.applicant?.profile?.profilePhoto : candidate.profilePhoto;

    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {name?.[0]?.toUpperCase() || '?'}
            </Avatar>
            <Box>
              <Typography variant="h5">{name}</Typography>
              <Typography variant="body2" color="textSecondary">{email}</Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {phone && (
              <Box display="flex" alignItems="center" gap={1}>
                <Phone fontSize="small" color="action" />
                <Typography>{phone}</Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" gap={1}>
              <Work fontSize="small" color="action" />
              <Typography>Applied for: <strong>{jobTitle || 'N/A'}</strong></Typography>
            </Box>
            {skills.length > 0 && (
              <Box>
                <Typography variant="subtitle2">Skills</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {skills.map(skill => <Chip key={skill} label={skill} size="small" />)}
                </Box>
              </Box>
            )}
            {experience !== undefined && (
              <Box display="flex" alignItems="center" gap={1}>
                <School fontSize="small" color="action" />
                <Typography>Experience: {experience} years</Typography>
              </Box>
            )}
            {resume && (
              <Box>
                <Button
                  startIcon={<Download />}
                  variant="outlined"
                  href={getResumeUrl(resume)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Resume
                </Button>
              </Box>
            )}
            {profilePhoto && (
              <Box>
                <Typography variant="subtitle2">Profile Photo</Typography>
                <img src={getResumeUrl(profilePhoto)} alt="Profile" style={{ maxWidth: '100%', maxHeight: 200 }} />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading && activeTab === 0) return <LoadingSpinner />;
  if (loadingPushed && activeTab === 1) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Candidates</Typography>
        <TextField
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)} sx={{ mb: 2 }}>
        <Tab label="All Candidates" />
        <Tab label="Pushed by Recruiters" />
      </Tabs>

      {/* All Candidates Tab */}
      {activeTab === 0 && (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap={3}>
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6">{candidate.name}</Typography>
                    <Typography color="textSecondary">{candidate.email}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Applied for: {candidate.jobTitle}
                    </Typography>
                  </Box>
                  <Chip
                    label={candidate.status}
                    color={getStatusColor(candidate.status)}
                    size="small"
                  />
                </Box>

                {/* Mini Pipeline */}
                <Stepper activeStep={pipelineStages.indexOf(candidate.status)} alternativeLabel sx={{ mt: 2, mb: 2 }}>
                  {pipelineStages.map((stage) => (
                    <Step key={stage}>
                      <StepLabel>{stage}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Actions */}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openProfile(candidate)}
                  >
                    View Profile
                  </Button>

                  {candidate.status !== 'hired' && (
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => updateCandidateStatus(candidate.id, 'hired')}
                    >
                      Hire
                    </Button>
                  )}

                  {candidate.status !== 'rejected' && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => updateCandidateStatus(candidate.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  )}

                  {candidate.status !== 'hired' && candidate.status !== 'rejected' && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleNextStage(candidate.id, candidate.status)}
                    >
                      Next Stage
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Pushed Candidates Tab */}
      {activeTab === 1 && (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap={3}>
          {filteredPushed.map((candidate) => {
            const applicant = candidate.applicant || {};
            const job = candidate.job || {};
            return (
              <Card key={candidate._id}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6">{applicant.fullname || 'Unknown'}</Typography>
                      <Typography color="textSecondary">{applicant.email}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Pushed for: {job.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Pushed by: {candidate.recruiter?.fullname || 'Recruiter'}
                      </Typography>
                    </Box>
                    <Chip label="Pushed" color="info" size="small" />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openProfile(candidate)}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={async () => {
                        try {
                          await api.put(`/company/workflow/candidates/${candidate._id}/status`, {
                            status: 'company_first_round',
                            notes: 'Accepted from pushed candidates'
                          });
                          toast.success('Candidate accepted');
                          fetchPushedCandidates(); // refresh list
                        } catch (err) {
                          toast.error('Failed to accept candidate');
                        }
                      }}
                    >
                      Accept for Interview
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Empty State */}
      {((activeTab === 0 && filteredCandidates.length === 0) ||
        (activeTab === 1 && filteredPushed.length === 0)) && (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
          <Typography variant="body1">
            {searchTerm ? 'No candidates match your search' : 'No candidates found'}
          </Typography>
        </Paper>
      )}

      {/* Profile Dialog */}
      {profileDialogOpen && (
        <CandidateProfileDialog
          candidate={selectedCandidate}
          onClose={() => setProfileDialogOpen(false)}
        />
      )}
    </Container>
  );
};

export default Candidates;
