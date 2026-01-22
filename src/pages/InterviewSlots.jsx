// src/pages/company/InterviewSlots.jsx - NEW FILE
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Schedule,
  CheckCircle,
  Cancel,
  Visibility
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const InterviewSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSlot, setEditSlot] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'video',
    maxCandidates: 1,
    notes: ''
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00'
  ];

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/company/workflow/slots', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSlots(data.data.slots || []);
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleCreateSlot = async () => {
    try {
      const response = await fetch('/api/company/workflow/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: 'create',
          ...formData,
          date: format(formData.date, 'yyyy-MM-dd')
        })
      });

      if (response.ok) {
        setDialogOpen(false);
        resetForm();
        fetchSlots();
      }
    } catch (error) {
      console.error('Failed to create slot:', error);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;

    try {
      const response = await fetch('/api/company/workflow/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: 'delete',
          slotId
        })
      });

      if (response.ok) {
        fetchSlots();
      }
    } catch (error) {
      console.error('Failed to delete slot:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      type: 'video',
      maxCandidates: 1,
      notes: ''
    });
    setEditSlot(null);
  };

  const calculateDuration = (start, end) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Interview Slots Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Provide available time slots for recruiters to schedule interviews
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            Add New Slot
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Recruiters can only book interviews from the slots you provide here. 
          Each slot can accommodate multiple candidates based on your setting.
        </Alert>

        {/* SLOTS GRID */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Typography align="center" py={4}>Loading slots...</Typography>
            </Grid>
          ) : slots.length > 0 ? (
            slots.map((slot) => (
              <Grid item xs={12} md={6} lg={4} key={slot._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6">
                          {format(new Date(slot.date), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {slot.startTime} - {slot.endTime} ({slot.duration} mins)
                        </Typography>
                      </Box>
                      <Chip
                        label={slot.type}
                        size="small"
                        color={slot.type === 'video' ? 'primary' : 'default'}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2">
                        <strong>Available:</strong> {slot.maxCandidates - slot.bookedCandidates.length} / {slot.maxCandidates}
                      </Typography>
                      <Chip
                        label={slot.isAvailable ? 'Available' : 'Full'}
                        color={slot.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>

                    {slot.notes && (
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Notes: {slot.notes}
                      </Typography>
                    )}

                    <Box display="flex" justifyContent="space-between">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSlot(slot._id)}
                      >
                        <Delete />
                      </IconButton>
                      <Chip
                        icon={<Schedule />}
                        label="Booked"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Schedule sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Interview Slots Created
                </Typography>
                <Typography color="text.secondary" mb={3}>
                  Create interview slots to allow recruiters to schedule candidate interviews.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setDialogOpen(true)}
                >
                  Create Your First Slot
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* CREATE/EDIT DIALOG */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editSlot ? 'Edit Interview Slot' : 'Create New Interview Slot'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <DatePicker
                label="Interview Date"
                value={formData.date}
                onChange={(newDate) => setFormData({ ...formData, date: newDate })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              <FormControl fullWidth>
                <InputLabel>Start Time</InputLabel>
                <Select
                  value={formData.startTime}
                  label="Start Time"
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                >
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>{time}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>End Time</InputLabel>
                <Select
                  value={formData.endTime}
                  label="End Time"
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                >
                  {timeSlots
                    .filter(time => time > formData.startTime)
                    .map((time) => (
                      <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary">
                Duration: {calculateDuration(formData.startTime, formData.endTime)} minutes
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Interview Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Interview Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="video">Video Call</MenuItem>
                  <MenuItem value="phone">Phone Call</MenuItem>
                  <MenuItem value="in_person">In-Person</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Maximum Candidates"
                type="number"
                value={formData.maxCandidates}
                onChange={(e) => setFormData({ ...formData, maxCandidates: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1, max: 10 }}
                helperText="How many candidates can be scheduled in this slot?"
                fullWidth
              />

              <TextField
                label="Notes (Optional)"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleCreateSlot}
              disabled={!formData.date || !formData.startTime || !formData.endTime}
            >
              {editSlot ? 'Update Slot' : 'Create Slot'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default InterviewSlots;