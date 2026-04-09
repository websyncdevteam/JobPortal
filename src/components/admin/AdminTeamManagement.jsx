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
  Tabs,
  Tab,
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamJobs, setTeamJobs] = useState([]);
  const [teamActivity, setTeamActivity] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/teams');
      setTeams(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      const recruiters = (res.data.users || []).filter(u => u.role === 'recruiter');
      setUsers(recruiters);
    } catch (err) {
      console.error(err);
    }
  };

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

  useEffect(() => {
    fetchTeams();
    fetchUsers();
    fetchCompanies();
  }, []);

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

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Delete this team? This will unassign all members and companies.')) return;
    try {
      await api.delete(`/admin/teams/${teamId}`);
      toast.success('Team deleted');
      await fetchTeams();
    } catch (err) {
      toast.error('Failed to delete team');
    }
  };

  const viewTeamDetails = async (team) => {
    setSelectedTeam(team);
    setActiveTab(0);
    try {
      // Fetch assigned companies
      const companiesRes = await api.get(`/admin/teams/${team._id}/companies`);
      setTeamCompanies(companiesRes.data.data || []);
      // Fetch members
      const membersRes = await api.get(`/admin/teams/${team._id}/members`);
      setTeamMembers(membersRes.data.members || []);
      // Fetch jobs (optional, requires backend endpoint – see note)
      try {
        const jobsRes = await api.get(`/admin/teams/${team._id}/jobs`);
        setTeamJobs(jobsRes.data.jobs || []);
      } catch (err) { /* jobs endpoint may not exist yet */ }
      // Fetch activity
      const activityRes = await api.get(`/admin/teams/${team._id}/activity`);
      setTeamActivity(activityRes.data.data || []);

      // Compute available companies (only unassigned ones)
      const assignedIds = (companiesRes.data.data || []).map(c => c._id);
      const available = allCompanies.filter(c => !assignedIds.includes(c._id));
      setAvailableCompanies(available);
      setSelectedCompanyId('');
    } catch (err) {
      toast.error('Failed to load team details');
    }
  };

  const handleAssignCompany = async () => {
    if (!selectedTeam || !selectedCompanyId) return;
    setAssigning(true);
    try {
      await api.post(`/admin/teams/${selectedTeam._id}/assign-company`, { companyId: selectedCompanyId });
      toast.success('Company assigned to team');
      await viewTeamDetails(selectedTeam); // refresh all data
      await fetchTeams(); // update main table counts
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveCompany = async (companyId) => {
    if (!selectedTeam) return;
    try {
      await api.delete(`/admin/teams/${selectedTeam._id}/companies/${companyId}`);
      toast.success('Company removed from team');
      await viewTeamDetails(selectedTeam);
      await fetchTeams();
    } catch (err) {
      toast.error('Removal failed');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Team Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={fetchTeams}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
            New Team
          </Button>
        </Box>
      </Box>

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

      {/* Team Details Dialog with Tabs */}
      <Dialog open={!!selectedTeam} onClose={() => setSelectedTeam(null)} maxWidth="lg" fullWidth>
        <DialogTitle>Team: {selectedTeam?.name}</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
            <Tab label="Companies" />
            <Tab label="Members" />
            <Tab label="Jobs" />
            <Tab label="Activity" />
          </Tabs>

          {activeTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom>Assigned Companies</Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Company Name</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
                  <TableBody>
                    {teamCompanies.map(company => (
                      <TableRow key={company._id}>
                        <TableCell>{company.name}</TableCell>
                        <TableCell><IconButton onClick={() => handleRemoveCompany(company._id)}><Delete /></IconButton></TableCell>
                      </TableRow>
                    ))}
                    {teamCompanies.length === 0 && <TableRow><TableCell colSpan={2}>No companies assigned</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Select size="small" value={selectedCompanyId} onChange={(e) => setSelectedCompanyId(e.target.value)} displayEmpty sx={{ minWidth: 200 }}>
                  <MenuItem value="">Select a company</MenuItem>
                  {availableCompanies.map(company => (<MenuItem key={company._id} value={company._id}>{company.name}</MenuItem>))}
                </Select>
                <Button variant="outlined" onClick={handleAssignCompany} disabled={assigning || !selectedCompanyId}>
                  {assigning ? <CircularProgress size={24} /> : 'Assign Company'}
                </Button>
              </Box>
            </>
          )}

          {activeTab === 1 && (
            <>
              <Typography variant="h6" gutterBottom>Team Members</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell></TableRow></TableHead>
                  <TableBody>
                    {teamMembers.map(member => (
                      <TableRow key={member._id}>
                        <TableCell>{member.fullname}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                      </TableRow>
                    ))}
                    {teamMembers.length === 0 && <TableRow><TableCell colSpan={3}>No members</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {activeTab === 2 && (
            <>
              <Typography variant="h6" gutterBottom>Jobs Posted</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Job Title</TableCell><TableCell>Company</TableCell><TableCell>Status</TableCell><TableCell>Applications</TableCell></TableRow></TableHead>
                  <TableBody>
                    {teamJobs.map(job => (
                      <TableRow key={job._id}>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company?.name}</TableCell>
                        <TableCell>{job.status}</TableCell>
                        <TableCell>{job.applications?.length || 0}</TableCell>
                      </TableRow>
                    ))}
                    {teamJobs.length === 0 && <TableRow><TableCell colSpan={4}>No jobs posted</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {activeTab === 3 && (
            <>
              <Typography variant="h6" gutterBottom>Activity Log</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamActivity.map(act => (
                      <TableRow key={act._id}>
                        <TableCell>{act.user?.fullname || 'Unknown'}</TableCell>
                        <TableCell>{act.type?.replace(/_/g, ' ')}</TableCell>
                        <TableCell>{act.message}</TableCell>
                        <TableCell>{new Date(act.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {teamActivity.length === 0 && <TableRow><TableCell colSpan={4}>No activity yet</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTeam(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTeamManagement;
