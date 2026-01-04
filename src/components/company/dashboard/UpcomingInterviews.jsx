import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Schedule,
  Person,
} from '@mui/icons-material';

const UpcomingInterviews = ({ interviews }) => {
  const formatInterviewDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'interview-1':
        return 'primary';
      case 'interview-2':
        return 'secondary';
      case 'final-round':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <List sx={{ width: '100%' }}>
      {interviews && interviews.length > 0 ? (
        interviews.map((interview, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <Schedule sx={{ fontSize: 18 }} />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={
                <Box>
                  <Typography variant="subtitle2" component="span">
                    {interview.candidateName}
                  </Typography>
                  <Chip
                    label={interview.interviewStage.replace(/-/g, ' ')}
                    size="small"
                    color={getStageColor(interview.interviewStage)}
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.primary">
                    {interview.jobTitle}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatInterviewDate(interview.interviewDate)}
                  </Typography>
                </Box>
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
          flexDirection="column"
        >
          <Avatar sx={{ bgcolor: 'grey.200', width: 40, height: 40, mb: 1 }}>
            <Schedule sx={{ color: 'grey.500' }} />
          </Avatar>
          <Typography variant="body2" color="textSecondary" align="center">
            No upcoming interviews
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default UpcomingInterviews;