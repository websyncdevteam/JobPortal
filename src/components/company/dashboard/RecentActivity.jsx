import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import {
  Person,
  Work,
  Schedule,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'hired':
        return <CheckCircle color="success" />;
      case 'offer':
        return <Work color="warning" />;
      case 'interview':
        return <Schedule color="info" />;
      case 'rejected':
        return <Cancel color="error" />;
      default:
        return <Person color="primary" />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'hired':
        return `${activity.candidateName} was hired for ${activity.jobTitle}`;
      case 'offer':
        return `Offer sent to ${activity.candidateName} for ${activity.jobTitle}`;
      case 'interview':
        return `Interview scheduled with ${activity.candidateName} for ${activity.jobTitle}`;
      case 'rejected':
        return `${activity.candidateName} was rejected for ${activity.jobTitle}`;
      default:
        return `${activity.candidateName} applied for ${activity.jobTitle}`;
    }
  };

  return (
    <List sx={{ width: '100%' }}>
      {activities && activities.length > 0 ? (
        activities.map((activity, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'transparent', width: 32, height: 32 }}>
                {getActivityIcon(activity.type)}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={getActivityText(activity)}
              secondary={
                <Typography variant="caption" color="textSecondary">
                  {new Date(activity.date).toLocaleDateString()} • {new Date(activity.date).toLocaleTimeString()}
                </Typography>
              }
            />
          </ListItem>
        ))
      ) : (
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          py={3}
        >
          <Typography variant="body2" color="textSecondary">
            No recent activity
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default RecentActivity;