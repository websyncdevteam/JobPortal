import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add, Delete, PersonAdd } from '@mui/icons-material';

const SubAdminTeamManagement = () => {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [unassignedRecruiters, setUnassignedRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState('');

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const membersRes = await api.get('/team/members');
      setMembers(membersRes.data.members);
      const teamRes = await api.get('/team');
      setTeam(teamRes.data.team);
      const compRes = await api.get('/team/companies');
      setCompanies(compRes.data.data);
    } catch (err) {
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedRecruiters = async () => {
    try {
      const res = await api.get('/team/recruiters/unassigned');
      setUnassignedRecruiters(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeamData();
    fetchUnassignedRecruiters();
  }, []);

  const handleAddMember = async () => {
    if (!selectedRecruiterId) return;
    try {
      await api.post('/team/members', { userId: selectedRecruiterId });
      toast.success('Recruiter added to team');
      setSelectedRecruiterId('');
      setInviteOpen(false);
      fetchTeamData();
      fetchUnassignedRecruiters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this recruiter from team?')) return;
    try {
      await api.delete(`/team/members/${userId}`);
      toast.success('Member removed');
      fetchTeamData();
      fetchUnassignedRecruiters();
    } catch (err) {
      toast.error('Removal failed');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!team) return <Typography>You are not assigned to any team.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Team: {team.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {team.description}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Team Members</Typography>
                <Button startIcon={<PersonAdd />} variant="outlined" size="small" onClick={() => setInviteOpen(true)}>
                  Add Member
                </Button>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map(member => (
                      <TableRow key={member._id}>
                        <TableCell>{member.fullname}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveMember(member._id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Assigned Companies</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Company Name</TableCell>
                      <TableCell>Industry</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies.map(company => (
                      <TableRow key={company._id}>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{company.industry || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Member Dialog */}
      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Recruiter to Team</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            margin="dense"
            value={selectedRecruiterId}
            onChange={(e) => setSelectedRecruiterId(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Select a recruiter (unassigned)</MenuItem>
            {unassignedRecruiters.map(recruiter => (
              <MenuItem key={recruiter._id} value={recruiter._id}>
                {recruiter.fullname} ({recruiter.email})
              </MenuItem>
            ))}
          </Select>
          {unassignedRecruiters.length === 0 && (
            <Typography variant="caption" color="text.secondary">
              No unassigned recruiters available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMember} variant="contained" disabled={!selectedRecruiterId}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubAdminTeamManagement;
