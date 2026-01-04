import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  Stack,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useCandidates } from '@/context/companyContext/CandidatesContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const pipelineStages = ['applied', 'reviewed', 'interviewing', 'offered', 'hired', 'rejected'];

const CandidateProfile = () => {
  const { candidateId } = useParams();
  const { candidates, updateCandidateStatus, addNote, scheduleInterview } = useCandidates();
  const candidate = candidates.find((c) => c.id === Number(candidateId));

  const [newNote, setNewNote] = useState('');
  const [interviewDate, setInterviewDate] = useState(null);
  const [interviewStage, setInterviewStage] = useState('interviewing');

  if (!candidate) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6">Candidate not found.</Typography>
      </Container>
    );
  }

  const handleAddNote = async () => {
    if (newNote.trim()) {
      await addNote(candidate.id, newNote);
      setNewNote('');
    }
  };

  const handleScheduleInterview = async () => {
    if (interviewDate) {
      await scheduleInterview(
        candidate.id,
        dayjs(interviewDate).format('YYYY-MM-DD'),
        interviewStage
      );
      setInterviewDate(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {candidate.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {candidate.email} | {candidate.phone}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Applied for: {candidate.jobTitle}
        </Typography>

        <Chip
          label={candidate.status}
          color={
            candidate.status === 'hired'
              ? 'success'
              : candidate.status === 'rejected'
              ? 'error'
              : 'primary'
          }
          sx={{ mt: 2 }}
        />

        {/* Status Actions */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {candidate.status !== 'hired' && (
            <Button
              variant="contained"
              color="success"
              onClick={() => updateCandidateStatus(candidate.id, 'hired')}
            >
              Hire
            </Button>
          )}
          {candidate.status !== 'rejected' && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => updateCandidateStatus(candidate.id, 'rejected')}
            >
              Reject
            </Button>
          )}
          {candidate.status !== 'hired' && candidate.status !== 'rejected' && (
            <Button
              variant="contained"
              onClick={() => {
                const currentIndex = pipelineStages.indexOf(candidate.status);
                const nextStage = pipelineStages[currentIndex + 1] || candidate.status;
                updateCandidateStatus(candidate.id, nextStage);
              }}
            >
              Next Stage
            </Button>
          )}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Notes */}
        <Typography variant="h6" gutterBottom>
          Notes
        </Typography>
        {candidate.notes?.map((n, i) => (
          <Paper key={i} sx={{ p: 2, mb: 1 }}>
            <Typography variant="body2">{n.note}</Typography>
            <Typography variant="caption" color="textSecondary">
              {n.createdBy} — {n.createdAt}
            </Typography>
          </Paper>
        ))}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={handleAddNote}>
            Add
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Interview */}
        <Typography variant="h6" gutterBottom>
          Interview
        </Typography>
        {candidate.interviewDate ? (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Scheduled for {candidate.interviewDate} ({candidate.interviewStage})
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ mb: 1 }}>
            No interview scheduled yet.
          </Typography>
        )}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <DatePicker
              label="Interview Date"
              value={interviewDate}
              onChange={(newValue) => setInterviewDate(newValue)}
            />
            <TextField
              label="Stage"
              value={interviewStage}
              onChange={(e) => setInterviewStage(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={handleScheduleInterview}>
              Schedule
            </Button>
          </Stack>
        </LocalizationProvider>
      </Paper>
    </Container>
  );
};

export default CandidateProfile;
