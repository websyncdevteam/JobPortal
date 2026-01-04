// src/components/company/dashboard/StatsCards.jsx - UPDATED
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  People,
  Work,
  Schedule,
  AssignmentTurnedIn,
  TrendingUp,
  Group,
  CheckCircle,
  PendingActions
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, subtext, progress }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtext && (
              <Typography variant="caption" color="text.secondary">
                {subtext}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {progress}% complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const StatsCards = ({ stats }) => {
  const {
    totalJobs = 0,
    activeJobs = 0,
    totalApplications = 0,
    newApplications = 0,
    interviewing = 0,
    selected = 0,
    upcomingInterviews = 0,
    totalRecruiters = 0,
    activeRecruiters = 0
  } = stats || {};

  // Calculate conversion rate
  const conversionRate = totalApplications > 0 
    ? Math.round((selected / totalApplications) * 100) 
    : 0;

  // Calculate recruiter activity
  const recruiterActivity = totalRecruiters > 0
    ? Math.round((activeRecruiters / totalRecruiters) * 100)
    : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Jobs"
          value={totalJobs}
          subtext={`${activeJobs} active`}
          icon={<Work />}
          color="primary"
          progress={totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Applications"
          value={totalApplications}
          subtext={`${newApplications} new`}
          icon={<People />}
          color="info"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Tooltip title={`${interviewing} candidates in interviews, ${selected} selected`}>
          <div>
            <StatCard
              title="In Process"
              value={interviewing + selected}
              subtext={`${selected} selected`}
              icon={<PendingActions />}
              color="warning"
            />
          </div>
        </Tooltip>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtext={`${selected}/${totalApplications}`}
          icon={<TrendingUp />}
          color="success"
          progress={conversionRate}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Upcoming Interviews"
          value={upcomingInterviews}
          icon={<Schedule />}
          color="secondary"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Recruiters"
          value={totalRecruiters}
          subtext={`${activeRecruiters} active`}
          icon={<Group />}
          color="primary"
          progress={recruiterActivity}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Interviewing"
          value={interviewing}
          icon={<Schedule />}
          color="warning"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Selected"
          value={selected}
          icon={<CheckCircle />}
          color="success"
        />
      </Grid>
    </Grid>
  );
};

export default StatsCards;