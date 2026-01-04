import  { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../../context/companyContext/CandidatesContext';
import LoadingSpinner from './common/LoadingSpinner';

const pipelineStages = ["applied", "reviewed", "interviewing", "offered", "hired", "rejected"];

const Candidates = () => {
  const { candidates, loading, updateCandidateStatus } = useCandidates();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">All Candidates</Typography>
        <TextField
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
      </Box>

      {/* Candidate List */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap={3}>
        {filteredCandidates.map((candidate) => {
          const currentStageIndex = pipelineStages.indexOf(candidate.status);

          return (
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
                <Stepper activeStep={currentStageIndex} alternativeLabel sx={{ mt: 2, mb: 2 }}>
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
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
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
          );
        })}
      </Box>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
          <Typography variant="body1">
            {searchTerm ? 'No candidates match your search' : 'No candidates found'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Candidates;
