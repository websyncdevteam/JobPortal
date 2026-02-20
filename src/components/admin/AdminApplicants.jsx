import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/api";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Chip,
  FormControl,
  Card,
  CardContent,
  Grid,
  Avatar,
  LinearProgress,
  Tooltip,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as PendingIcon,
  Star as StarIcon
} from "@mui/icons-material";

// Use environment variable or production URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com';

// Enhanced status options with icons and descriptions
const statusOptions = [
  { 
    value: "pending", 
    label: "Pending Review", 
    category: "applied", 
    icon: <PendingIcon />,
    description: "Application received, awaiting initial review",
    color: "default"
  },
  { 
    value: "under review", 
    label: "Under Review", 
    category: "review", 
    icon: <PersonIcon />,
    description: "Application is being evaluated by recruiters",
    color: "info"
  },
  { 
    value: "shortlisted", 
    label: "Shortlisted", 
    category: "review", 
    icon: <StarIcon />,
    description: "Candidate has been shortlisted for next round",
    color: "primary"
  },
  { 
    value: "forwarded to first round", 
    label: "First Technical Round", 
    category: "interview", 
    icon: <PersonIcon />,
    description: "Forwarded to first technical interview",
    color: "secondary"
  },
  { 
    value: "forwarded to second round", 
    label: "Second Technical Round", 
    category: "interview", 
    icon: <PersonIcon />,
    description: "Forwarded to second technical interview",
    color: "secondary"
  },
  { 
    value: "interview scheduled", 
    label: "Interview Scheduled", 
    category: "interview", 
    icon: <PersonIcon />,
    description: "Interview has been scheduled with candidate",
    color: "warning"
  },
  { 
    value: "selected", 
    label: "Selected", 
    category: "offer", 
    icon: <CheckIcon />,
    description: "Candidate has been selected for offer",
    color: "success"
  },
  { 
    value: "accepted", 
    label: "Offer Accepted", 
    category: "hired", 
    icon: <CheckIcon />,
    description: "Candidate has accepted the offer",
    color: "success"
  },
  { 
    value: "rejected", 
    label: "Rejected", 
    category: "rejected", 
    icon: <CancelIcon />,
    description: "Candidate has been rejected",
    color: "error"
  },
  { 
    value: "on hold", 
    label: "On Hold", 
    category: "hold", 
    icon: <PendingIcon />,
    description: "Application put on hold temporarily",
    color: "default"
  },
  { 
    value: "joined", 
    label: "Joined", 
    category: "hired", 
    icon: <CheckIcon />,
    description: "Candidate has joined the organization",
    color: "success"
  }
];

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card sx={{ p: 3, m: 2, backgroundColor: '#fff5f5', border: '1px solid #fed7d7' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

const AdminApplicants = () => {
  const { jobId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [stats, setStats] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantDialog, setApplicantDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Safe data access helper
  const safeGet = (obj, path, defaultValue = null) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };

  // Memoized filtered applicants with safe data access
  const filteredApplicants = useMemo(() => {
    if (!job?.applications) return [];
    
    let filtered = job.applications;
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => {
        const applicant = safeGet(app, 'applicant', {});
        const fullname = safeGet(applicant, 'fullname', '').toLowerCase();
        const email = safeGet(applicant, 'email', '').toLowerCase();
        const skills = safeGet(applicant, 'profile.skills', []);
        
        return (
          fullname.includes(term) ||
          email.includes(term) ||
          skills.some(skill => skill.toLowerCase().includes(term))
        );
      });
    }
    
    return filtered;
  }, [job, filterStatus, searchTerm]);

  // Calculate application statistics with safe data access
  const calculateStats = (applications) => {
    const stats = {
      total: applications?.length || 0,
      byStatus: {},
      byCategory: {
        applied: 0,
        review: 0,
        interview: 0,
        offer: 0,
        hired: 0,
        rejected: 0,
        hold: 0
      }
    };

    applications?.forEach(app => {
      const status = safeGet(app, 'status', 'pending');
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      
      const statusOption = statusOptions.find(opt => opt.value === status);
      if (statusOption) {
        stats.byCategory[statusOption.category] = (stats.byCategory[statusOption.category] || 0) + 1;
      }
    });

    return stats;
  };

  // Enhanced file URL handling
  const getFileUrl = (filePath) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    
    // Remove any leading slashes
    const cleanPath = filePath.replace(/^\/+/, '');
    
    // If it already starts with api/uploads, just add BASE_URL
    if (cleanPath.startsWith('api/uploads/')) {
      return `${BASE_URL}/${cleanPath}`;
    }
    
    // If it starts with uploads/, add /api/ prefix
    if (cleanPath.startsWith('uploads/')) {
      return `${BASE_URL}/api/${cleanPath}`;
    }
    
    // Otherwise, assume it's just a filename
    return `${BASE_URL}/api/uploads/${cleanPath}`;
  };

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/application/${jobId}/applicants`);
      
      if (res.data.success && res.data.job) {
        setJob(res.data.job);
        setStats(calculateStats(res.data.job.applications || []));
      } else {
        throw new Error(res.data.message || 'Failed to fetch applicants');
      }
    } catch (err) {
      console.error("Failed to load applicants:", err);
      setSnackbar({ 
        open: true, 
        message: safeGet(err, 'response.data.message') || "Failed to load applicants", 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId && jobId !== 'undefined') {
      fetchApplicants();
    }
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [applicationId]: true }));
      
      const res = await axios.patch(
        `/application/status/${applicationId}`,
        { status: newStatus }
      );

      if (res.data.success) {
        setJob((prevJob) => {
          const updatedApps = prevJob.applications.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          );
          return { ...prevJob, applications: updatedApps };
        });

        setStats(prevStats => calculateStats(
          job.applications.map(app => 
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        ));

        setSnackbar({ 
          open: true, 
          message: `Status updated to ${newStatus}`, 
          severity: "success" 
        });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setSnackbar({ 
        open: true, 
        message: safeGet(err, 'response.data.message') || "Failed to update status", 
        severity: "error" 
      });
    } finally {
      setUpdating(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleViewApplicant = (applicant) => {
    if (!applicant) {
      console.error('Attempted to view null applicant');
      setSnackbar({
        open: true,
        message: "Cannot view applicant details",
        severity: "error"
      });
      return;
    }
    setSelectedApplicant(applicant);
    setApplicantDialog(true);
  };

  const StatusChip = ({ status, size = "small" }) => {
    const statusConfig = statusOptions.find(opt => opt.value === status) || statusOptions[0];
    return (
      <Tooltip title={statusConfig.description} arrow>
        <Chip 
          icon={statusConfig.icon}
          label={isMobile ? statusConfig.label.split(' ')[0] : statusConfig.label}
          color={statusConfig.color}
          variant="filled"
          size={size}
          sx={{ 
            fontWeight: 'bold',
            maxWidth: isMobile ? 100 : 140,
            '& .MuiChip-icon': { color: 'inherit !important' }
          }}
        />
      </Tooltip>
    );
  };

  // Safe Applicant Detail View Component
  const ApplicantDetailView = ({ applicant, onClose }) => {
    // Safe data extraction with fallbacks
    const user = safeGet(applicant, 'applicant', {});
    const profile = safeGet(user, 'profile', {});
    const skills = safeGet(profile, 'skills', []);
    const experience = safeGet(profile, 'experience', 0);
    const resume = safeGet(profile, 'resume');
    const location = safeGet(profile, 'location');
    const phoneNumber = safeGet(user, 'phoneNumber');
    const email = safeGet(user, 'email', 'No email provided');
    const fullname = safeGet(user, 'fullname', 'Unknown Candidate');

    if (!applicant) {
      return (
        <Dialog open onClose={onClose}>
          <DialogContent>
            <Typography color="error">No applicant data available</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </Dialog>
      );
    }

    return (
      <Dialog 
        fullScreen={isSmallMobile} 
        maxWidth="md" 
        fullWidth 
        open={!!applicant} 
        onClose={onClose}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {fullname}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <ErrorBoundary>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="action" />
                        <Typography>{email}</Typography>
                      </Box>
                      {phoneNumber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon color="action" />
                          <Typography>{phoneNumber}</Typography>
                        </Box>
                      )}
                      {location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon color="action" />
                          <Typography>{location}</Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Application Status</Typography>
                    <Box sx={{ mb: 2 }}>
                      <StatusChip status={safeGet(applicant, 'status', 'pending')} size="medium" />
                    </Box>
                    <FormControl fullWidth size="small">
                      <Select
                        value={safeGet(applicant, 'status', 'pending')}
                        onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {status.icon}
                              <Typography>{status.label}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Skills & Experience</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {skills.map((skill, index) => (
                        <Chip key={index} label={skill} variant="outlined" />
                      ))}
                      {skills.length === 0 && (
                        <Typography color="text.secondary">No skills listed</Typography>
                      )}
                    </Box>
                    <Typography>
                      <strong>Experience:</strong> {experience} years
                    </Typography>
                    {safeGet(profile, 'bio') && (
                      <Typography sx={{ mt: 1 }}>
                        <strong>Bio:</strong> {profile.bio}
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </ErrorBoundary>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          {resume && (
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              onClick={() => window.open(getFileUrl(resume), '_blank')}
            >
              Download Resume
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  const MobileApplicantCard = ({ applicant }) => {
    const user = safeGet(applicant, 'applicant', {});
    const skills = safeGet(user, 'profile.skills', []);
    
    return (
      <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleViewApplicant(applicant)}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {safeGet(user, 'fullname', 'Unknown Candidate')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {safeGet(user, 'email', 'No email')}
              </Typography>
              <StatusChip status={safeGet(applicant, 'status', 'pending')} />
            </Box>
          </Box>

          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Experience
              </Typography>
              <Typography variant="body1">
                {safeGet(user, 'profile.experience', 0)} years
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Skills
              </Typography>
              <Typography variant="body1" noWrap>
                {skills.slice(0, 2).join(', ')}
                {skills.length > 2 && ` +${skills.length - 2}`}
              </Typography>
            </Grid>
          </Grid>

          {updating[applicant._id] && <LinearProgress sx={{ mt: 1 }} />}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh",
        flexDirection: "column",
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading Applicants...
        </Typography>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ p: isMobile ? 1 : 3, minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header Section */}
        <Card sx={{ 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
                  {safeGet(job, 'title', 'Unknown Job')}
                </Typography>
                <Typography variant={isMobile ? "body1" : "h6"} sx={{ opacity: 0.9 }}>
                  {safeGet(job, 'company.name', 'Unknown Company')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  Managing {stats.total} applicants
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'space-between' : 'flex-end'
              }}>
                <TextField
                  size="small"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 1,
                    minWidth: isMobile ? '60%' : 200
                  }}
                />
                <IconButton 
                  onClick={() => setMobileDrawer(true)}
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  <FilterIcon />
                </IconButton>
                <IconButton 
                  onClick={fetchApplicants}
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <ErrorBoundary>
          {isMobile ? (
            // Mobile View - Card Layout
            <Box>
              {filteredApplicants.map(applicant => (
                <MobileApplicantCard key={applicant._id} applicant={applicant} />
              ))}
              
              {filteredApplicants.length === 0 && (
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No applicants found
                  </Typography>
                </Card>
              )}
            </Box>
          ) : (
            // Desktop View - Table Layout
            <Card elevation={2}>
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Candidate</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Skills</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Experience</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredApplicants.map((applicant) => {
                        const user = safeGet(applicant, 'applicant', {});
                        const skills = safeGet(user, 'profile.skills', []);
                        
                        return (
                          <TableRow 
                            key={applicant._id} 
                            hover 
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleViewApplicant(applicant)}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  {safeGet(user, 'fullname[0]', '?').toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight="medium">
                                    {safeGet(user, 'fullname', 'Unknown Candidate')}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Applied {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'Unknown date'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            
                            <TableCell>
                              <StatusChip status={safeGet(applicant, 'status', 'pending')} />
                            </TableCell>
                            
                            <TableCell>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                                {skills.slice(0, 3).map((skill, index) => (
                                  <Chip key={index} label={skill} size="small" variant="outlined" />
                                ))}
                                {skills.length > 3 && (
                                  <Chip label={`+${skills.length - 3}`} size="small" />
                                )}
                                {skills.length === 0 && (
                                  <Typography variant="body2" color="text.secondary">No skills</Typography>
                                )}
                              </Box>
                            </TableCell>
                            
                            <TableCell>
                              <Typography>
                                {safeGet(user, 'profile.experience', 0)} years
                              </Typography>
                            </TableCell>
                            
                            <TableCell>
                              <Typography variant="body2">{safeGet(user, 'email', 'No email')}</Typography>
                              {safeGet(user, 'phoneNumber') && (
                                <Typography variant="body2" color="text.secondary">
                                  {user.phoneNumber}
                                </Typography>
                              )}
                            </TableCell>
                            
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {safeGet(user, 'profile.resume') && (
                                  <Tooltip title="Download Resume">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(getFileUrl(user.profile.resume), '_blank');
                                      }}
                                    >
                                      <DownloadIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="Quick Status Update">
                                  <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <Select
                                      value={safeGet(applicant, 'status', 'pending')}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(applicant._id, e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {statusOptions.map((status) => (
                                        <MenuItem key={status.value} value={status.value}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {status.icon}
                                            <Typography variant="body2">{status.label}</Typography>
                                          </Box>
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Applicant Detail Dialog */}
          {applicantDialog && (
            <ApplicantDetailView 
              applicant={selectedApplicant} 
              onClose={() => {
                setApplicantDialog(false);
                setSelectedApplicant(null);
              }} 
            />
          )}

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor="right"
            open={mobileDrawer}
            onClose={() => setMobileDrawer(false)}
          >
            <Box sx={{ width: 280, p: 2 }}>
              <Typography variant="h6" gutterBottom>Filters</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <StatusChip status={status.value} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => {
                  setFilterStatus('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Drawer>

          {/* Mobile Floating Action Button */}
          {isMobile && (
            <Fab
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
              }}
              onClick={() => setMobileDrawer(true)}
            >
              <FilterIcon />
            </Fab>
          )}

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </ErrorBoundary>
      </Box>
    </ErrorBoundary>
  );
};

export default AdminApplicants;
