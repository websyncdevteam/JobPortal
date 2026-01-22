import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Phone,
  Work,
  School,
  Schedule,
  Edit,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { companyAPI } from '../services/mockApi';
import LoadingSpinner from './common/LoadingSpinner';

const CandidateProfile = () => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newStage, setNewStage] = useState('');
  
  const { candidateId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const data = await companyAPI.getCandidate(candidateId);
        setCandidate(data);
      } catch (error) {
        console.error('Error fetching candidate:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId]);

  const handleStatusUpdate = async () => {
    try {
      const result = await companyAPI.updateCandidateStatus(candidateId, newStatus);
      if (result.success) {
        setCandidate(result.candidate);
        setStatusDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleStageUpdate = async () => {
    try {
      const result = await companyAPI.updateCandidateStage(candidateId, newStage);
      if (result.success) {
        setCandidate(result.candidate);
        setStageDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const handleAddNote = async () => {
    try {
      const result = await companyAPI.addCandidateNote(candidateId, newNote);
      if (result.success) {
        setCandidate(result.candidate);
        setNewNote('');
        setNoteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!candidate) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Candidate not found</Typography>
      </Container>
    );
  }

  const job = mockJobs.find(j => j.id === candidate.jobId);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">Candidate Profile</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar sx={{ width: 100, height: 100, mb: 2, fontSize: '2.5rem' }}>
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {candidate.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {job?.title}
              </Typography>
              <Chip 
                label={candidate.status} 
                color={getStatusColor(candidate.status)}
                sx={{ mb: 1 }}
              />
              <Chip 
                label={candidate.interviewStage.replace(/-/g, ' ')} 
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Box>

            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <Email sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography>{candidate.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography>{candidate.phone}</Typography>
              </Box>
              {candidate.interviewDate && (
                <Box display="flex" alignItems="center" mb={1}>
                  <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    Interview: {new Date(candidate.interviewDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setNewStatus(candidate.status);
                  setStatusDialogOpen(true);
                }}
              >
                Update Status
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setNewStage(candidate.interviewStage);
                  setStageDialogOpen(true);
                }}
              >
                Update Stage
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setNoteDialogOpen(true)}
              >
                Add Note
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {candidate.skills.map((skill, index) => (
                <Chip key={index} label={skill} size="small" />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            <Typography paragraph>{candidate.experience}</Typography>

            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Typography paragraph>{candidate.education}</Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Notes</Typography>
              <Button 
                startIcon={<Edit />} 
                onClick={() => setNoteDialogOpen(true)}
                size="small"
              >
                Add Note
              </Button>
            </Box>

            <List>
              {candidate.notes.map((note) => (
                <ListItem key={note.id} alignItems="flex-start">
                  <ListItemText
                    primary={note.note}
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {note.createdBy} • {new Date(note.createdAt).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Candidate Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="reviewed">Reviewed</MenuItem>
            <MenuItem value="interviewing">Interviewing</MenuItem>
            <MenuItem value="offered">Offered</MenuItem>
            <MenuItem value="hired">Hired</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stage Update Dialog */}
      <Dialog open={stageDialogOpen} onClose={() => setStageDialogOpen(false)}>
        <DialogTitle>Update Interview Stage</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Stage"
            value={newStage}
            onChange={(e) => setNewStage(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="screening">Screening</MenuItem>
            <MenuItem value="interview-1">Interview 1</MenuItem>
            <MenuItem value="interview-2">Interview 2</MenuItem>
            <MenuItem value="interview-3">Interview 3</MenuItem>
            <MenuItem value="final-round">Final Round</MenuItem>
            <MenuItem value="offer">Offer</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStageUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNote} variant="contained" disabled={!newNote.trim()}>
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CandidateProfile;