import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Add, Delete, Edit, Visibility } from '@mui/icons-material';

const AdminTeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', description: '', subAdminId: '' });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamCompanies, setTeamCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  // Fetch all teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/teams');
      const teamsData = res.data.data || [];
      // Compute company count by filtering allCompanies (fallback to 0)
      const teamsWithCount = teamsData.map(team => ({
        ...team,
        memberCount: team.memberCount ?? 0,
        companyCount: allCompanies.filter(c => c.team === team._id).length,
      }));
      setTeams(teamsWithCount);
    } catch (err) {
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all recruiters (for sub-admin dropdown)
  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      const recruiters = (res.data.users || []).filter(u => u.role === 'recruiter');
      setUsers(recruiters);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      let comps = [];
      if (res.data.companies) comps = res.data.companies;
      else if (res.data.data) comps = res.data.data;
      else if (Array.isArray(res.data)) comps = res.data;
      setAllCompanies(comps);
    } catch (err) {
      toast.error('Could not load companies');
    }
  };

  // Initial load
  useEffect(() => {
    fetchTeams();
    fetchUsers();
    fetchCompanies();
  }, []);

  // Refresh teams whenever allCompanies changes (so counts update)
  useEffect(() => {
    if (allCompanies.length) fetchTeams();
  }, [allCompanies]);

  // Create or update team
  const handleCreateTeam = async () => {
    if (!teamForm.name) return toast.error('Team name is required');
    try {
      const payload = {
        name: teamForm.name,
        description: teamForm.description,
        subAdminId: teamForm.subAdminId || undefined,
      };
      if (editTeam) {
        await api.patch(`/admin/teams/${editTeam._id}`, payload);
        toast.success('Team updated');
      } else {
        await api.post('/admin/teams', payload);
        toast.success('Team created');
      }
      setDialogOpen(false);
      setEditTeam(null);
      setTeamForm({ name: '', description: '', subAdminId: '' });
      await fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Delete this team? This will unassign all members and companies.')) return;
    try {
      await api.delete(`/admin/teams/${teamId}`);
      toast.success('Team deleted');
      // Remove team reference from companies in local state
      setAllCompanies(prev => prev.map(c => c.team === teamId ? { ...c, team: null } : c));
      await fetchTeams();
    } catch (err) {
      toast.error('Failed to delete team');
    }
  };

  // Open team details dialog (shows assigned companies and dropdown)
  const viewTeamDetails = async (team) => {
    setSelectedTeam(team);
    try {
      // Get assigned companies for this team
      const res = await api.get(`/admin/teams/${team._id}/companies`);
      const assigned = res.data.data || [];
      setTeamCompanies(assigned);
      // Available = all companies minus those already assigned to this team
      const assignedIds = assigned.map(c => c._id);
      const available = allCompanies.filter(c => !assignedIds.includes(c._id));
      setAvailableCompanies(available);
      setSelectedCompanyId('');
    } catch (err) {
      toast.error('Failed to load team companies');
    }
  };

  // Assign a company to the selected team
  const handleAssignCompany = async () => {
    if (!selectedTeam || !selectedCompanyId) return;
    setAssigning(true);
    try {
      await api.post(`/admin/teams/${selectedTeam._id}/assign-company`, { companyId: selectedCompanyId });
      toast.success('Company assigned to team');

      // Refresh companies list from server to get updated `team` field
      await fetchCompanies();

      // Refresh assigned companies for this team
      const res = await api.get(`/admin/teams/${selectedTeam._id}/companies`);
      const assigned = res.data.data || [];
      setTeamCompanies(assigned);

      // Recompute available companies (exclude newly assigned)
      const assignedIds = assigned.map(c => c._id);
      const newAvailable = allCompanies.filter(c => !assignedIds.includes(c._id));
      setAvailableCompanies(newAvailable);

      // Clear selection
      setSelectedCompanyId('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  // Remove a company from the team
  const handleRemoveCompany = async (companyId) => {
    if (!selectedTeam) return;
    try {
      await api.delete(`/admin/teams/${selectedTeam._id}/companies/${companyId}`);
      toast.success('Company removed from team');

      // Refresh companies list
      await fetchCompanies();

      // Refresh assigned companies
      const res = await api.get(`/admin/teams/${selectedTeam._id}/companies`);
      const assigned = res.data.data || [];
      setTeamCompanies(assigned);

      // Recompute available (now includes the removed company)
      const assignedIds = assigned.map(c => c._id);
      const newAvailable = allCompanies.filter(c => !assignedIds.includes(c._id));
      setAvailableCompanies(newAvailable);
    } catch (err) {
      toast.error('Removal failed');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Team Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          New Team
        </Button>
      </Box>

      {/* Teams Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sub‑Admin</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Companies</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
            ) : teams.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">No teams created yet.</TableCell></TableRow>
            ) : (
              teams.map(team => (
                <TableRow key={team._id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.description || '-'}</TableCell>
                  <TableCell>{team.subAdmin ? team.subAdmin.fullname : 'None'}</TableCell>
                  <TableCell>{team.memberCount || 0}</TableCell>
                  <TableCell>{team.companyCount || 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => viewTeamDetails(team)}><Visibility /></IconButton>
                    <IconButton onClick={() => { setEditTeam(team); setTeamForm({ name: team.name, description: team.description || '', subAdminId: team.subAdmin?._id || '' }); setDialogOpen(true); }}><Edit /></IconButton>
                    <IconButton onClick={() => handleDeleteTeam(team._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Team Dialog */}
      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditTeam(null); setTeamForm({ name: '', description: '', subAdminId: '' }); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editTeam ? 'Edit Team' : 'Create Team'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Team Name" fullWidth value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
          <TextField margin="dense" label="Description" fullWidth multiline rows={3} value={teamForm.description} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} />
          <Select fullWidth margin="dense" value={teamForm.subAdminId} onChange={(e) => setTeamForm({ ...teamForm, subAdminId: e.target.value })} displayEmpty>
            <MenuItem value="">None (no sub-admin)</MenuItem>
            {users.map(user => (<MenuItem key={user._id} value={user._id}>{user.fullname} ({user.email})</MenuItem>))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTeam} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Team Details Dialog (Assign/Remove Companies) */}
      <Dialog open={!!selectedTeam} onClose={() => setSelectedTeam(null)} maxWidth="md" fullWidth>
        <DialogTitle>Team: {selectedTeam?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Assigned Companies</Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead><TableRow><TableCell>Company Name</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
              <TableBody>
                {teamCompanies.length === 0 ? (
                  <TableRow><TableCell colSpan={2} align="center">No companies assigned</TableCell></TableRow>
                ) : (
                  teamCompanies.map(company => (
                    <TableRow key={company._id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell><IconButton onClick={() => handleRemoveCompany(company._id)}><Delete /></IconButton></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Select
              size="small"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              displayEmpty
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Select a company</MenuItem>
              {availableCompanies.length === 0 ? (
                <MenuItem disabled>No companies available</MenuItem>
              ) : (
                availableCompanies.map(company => (
                  <MenuItem key={company._id} value={company._id}>{company.name}</MenuItem>
                ))
              )}
            </Select>
            <Button variant="outlined" onClick={handleAssignCompany} disabled={assigning || !selectedCompanyId}>
              {assigning ? <CircularProgress size={24} /> : 'Assign Company'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTeam(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTeamManagement;
