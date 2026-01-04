import React from 'react';
import {
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Badge,
  Divider,
} from '@mui/material';
import {
  Close,
  Notifications,
  Person,
  Work,
  Schedule,
} from '@mui/icons-material';

const NotificationCenter = ({ open, setOpen }) => {
  const notifications = [
    {
      id: 1,
      title: 'New Candidate Applied',
      description: 'John Smith applied for Frontend Developer position',
      time: '2 hours ago',
      icon: <Person />,
      read: false,
    },
    {
      id: 2,
      title: 'Interview Scheduled',
      description: 'Interview with Emily Johnson scheduled for tomorrow at 2 PM',
      time: '5 hours ago',
      icon: <Schedule />,
      read: false,
    },
    {
      id: 3,
      title: 'Position Filled',
      description: 'Backend Developer position has been filled',
      time: '1 day ago',
      icon: <Work />,
      read: true,
    },
    {
      id: 4,
      title: 'New Candidate Applied',
      description: 'Michael Brown applied for UI/UX Designer position',
      time: '2 days ago',
      icon: <Person />,
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 380,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Notifications
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />
          )}
        </Typography>
        <IconButton onClick={() => setOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ width: '100%' }}>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              backgroundColor: notification.read ? 'transparent' : 'action.hover',
              borderLeft: notification.read ? 'none' : `4px solid`,
              borderLeftColor: 'primary.main',
            }}
          >
            <ListItemIcon>
              {notification.icon}
            </ListItemIcon>
            <ListItemText
              primary={notification.title}
              secondary={
                <React.Fragment>
                  <Typography variant="body2" color="text.primary">
                    {notification.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default NotificationCenter;