import  { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useParams, useNavigate } from 'react-router-dom';
import { companyAPI } from '../../services/companyservice/api'
const JobCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState('');
  
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await companyAPI.getJobCandidates(parseInt(jobId));
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId]);

  const handleStatusChange = (candidate) => {
    setSelectedCandidate(candidate);
    setStatus(candidate.status);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const result = await companyAPI.updateCandidateStatus(selectedCandidate.id, status);
      if (result.success) {
        setCandidates(prev => 
          prev.map(c => c.id === selectedCandidate.id ? result.candidate : c)
        );
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
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

  const candidateColumns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value)} 
          size="small" 
        />
      )
    },
    {
      field: 'interviewStage',
      headerName: 'Interview Stage',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleStatusChange(params.row)}
        >
          Update Status
        </Button>
      )
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Candidates
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>

      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={candidates}
            columns={candidateColumns}
            pageSize={10}
            getRowId={(row) => row.id}
          />
        </div>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Update Candidate Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobCandidates;