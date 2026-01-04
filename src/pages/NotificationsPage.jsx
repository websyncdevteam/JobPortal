import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Badge,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsOff,
  Email,
  Schedule,
  People,
  Work,
  CheckCircle,
  Delete,
  MarkEmailRead,
  Refresh,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { WorkflowService } from '../services/companyservice/workflowService';

const NotificationsPage = () => {
  const [notificationsData, setNotificationsData] = useState({
    notifications: [],
    unreadCount: 0,
    source: 'mock',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);
    
    try {
      const data = await WorkflowService.getNotifications();
      setNotificationsData(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications. Using cached data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await WorkflowService.markNotificationAsRead(notificationId);
      setSuccess('Notification marked as read');
      fetchNotifications(false); // Refresh without showing loading
    } catch (err) {
      console.error('Failed to mark as read:', err);
      setError('Failed to update notification status');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await WorkflowService.deleteNotification(notificationId);
      setSuccess('Notification deleted');
      fetchNotifications(false);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setError('Failed to delete notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await WorkflowService.markAllNotificationsAsRead();
      setSuccess('All notifications marked as read');
      fetchNotifications(false);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      setError('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'candidate_pushed':
        return <People color="primary" />;
      case 'interview_scheduled':
        return <Schedule color="warning" />;
      case 'application_update':
        return <Work color="info" />;
      case 'email':
        return <Email color="secondary" />;
      case 'offer_accepted':
        return <CheckCircle color="success" />;
      case 'job_expired':
        return <ErrorIcon color="error" />;
      default:
        return <Notifications color="action" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'candidate_pushed': return 'primary';
      case 'interview_scheduled': return 'warning';
      case 'application_update': return 'info';
      case 'email': return 'secondary';
      case 'offer_accepted': return 'success';
      case 'job_expired': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }
    } catch {
      return 'Recently';
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    setError('');
  };

  const { notifications, unreadCount, source } = notificationsData;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Notifications
            {source === 'mock' && (
              <Badge color="warning" badgeContent="Demo" sx={{ ml: 2 }}>
                <span></span>
              </Badge>
            )}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {unreadCount > 0 
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'Stay updated with candidate activities and recruiter actions'}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || loading}
          >
            Mark All Read
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => fetchNotifications(false)}
            disabled={refreshing}
          >
            {refreshing ? <CircularProgress size={20} /> : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* SOURCE INDICATOR */}
      {source === 'mock' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Using demo data. Real notifications will appear when backend is connected.
        </Alert>
      )}

      {/* NOTIFICATIONS LIST */}
      <Paper sx={{ p: 2, minHeight: 400 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : notifications.length > 0 ? (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id || index}>
                <ListItem
                  secondaryAction={
                    <Box display="flex" gap={1}>
                      {!notification.read && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => markAsRead(notification._id)}
                          title="Mark as read"
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        size="small"
                        color="error"
                        onClick={() => deleteNotification(notification._id)}
                        title="Delete"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    borderRadius: 1,
                    mb: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: notification.read ? 'action.hover' : 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography
                          variant="body1"
                          fontWeight={notification.read ? "normal" : "bold"}
                          sx={{ flex: 1 }}
                        >
                          {notification.message}
                        </Typography>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: `${getNotificationColor(notification.type)}.main`,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(notification.createdAt)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={`${getNotificationColor(notification.type)}.main`}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {notification.type?.replace(/_/g, ' ') || 'notification'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box textAlign="center" py={8}>
            <NotificationsOff sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Notifications
            </Typography>
            <Typography color="text.secondary" paragraph>
              You're all caught up! New notifications will appear here.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => fetchNotifications(false)}
            >
              Check Again
            </Button>
          </Box>
        )}
      </Paper>

      {/* STATS FOOTER */}
      {notifications.length > 0 && (
        <Box mt={3} display="flex" gap={2} flexWrap="wrap" justifyContent="space-between">
          <Box display="flex" gap={2}>
            <Badge badgeContent={notifications.length} color="primary">
              <Notifications color="action" />
            </Badge>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsActive color="action" />
            </Badge>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Data source: {source === 'api' ? 'Live API' : 'Demo Data'} • 
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
      )}

      {/* SNACKBARS */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={success}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={error}
        severity="error"
      />
    </Container>
  );
};

export default NotificationsPage;