import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  PhotoCamera,
  Security,
  NotificationsActive,
  DarkMode,
  AccountCircle,
  Save,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const steps = ['Profile', 'Account Security', 'Notifications', 'Preferences'];

const Settings = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // States
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleFinish = () => {
    alert('✅ Settings saved successfully!');
    setActiveStep(0);
  };

  // Step contents
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={3}>
              <AccountCircle sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Profile</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ width: 90, height: 90, mr: 2 }}>U</Avatar>
              <Tooltip title="Upload new picture">
                <IconButton color="primary" component="label">
                  <PhotoCamera />
                  <input hidden accept="image/*" type="file" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField label="Full Name" fullWidth margin="normal" defaultValue="John Doe" />
            <TextField label="Email Address" fullWidth margin="normal" defaultValue="john@example.com" />
            <TextField label="Company" fullWidth margin="normal" defaultValue="Acme Inc." />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={3}>
              <Security sx={{ fontSize: 30, mr: 1, color: 'error.main' }} />
              <Typography variant="h6">Account Security</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TextField label="Current Password" type="password" fullWidth margin="normal" />
            <TextField label="New Password" type="password" fullWidth margin="normal" />
            <TextField label="Confirm Password" type="password" fullWidth margin="normal" />
            <FormControlLabel
              control={<Switch checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />}
              label="Enable Two-Factor Authentication"
              sx={{ mt: 2 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={3}>
              <NotificationsActive sx={{ fontSize: 30, mr: 1, color: 'warning.main' }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={<Switch checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />}
              label="Email Notifications"
            />
            <Typography variant="body2" color="text.secondary" mb={2}>
              Get updates about new candidates, job matches, and account activity.
            </Typography>
            <FormControlLabel
              control={<Switch checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />}
              label="Push Notifications"
            />
            <Typography variant="body2" color="text.secondary" mb={2}>
              Receive instant alerts in your dashboard.
            </Typography>
            <FormControlLabel
              control={<Switch checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />}
              label="SMS Alerts"
            />
            <Typography variant="body2" color="text.secondary" mb={2}>
              Get text notifications for critical account updates.
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={3}>
              <DarkMode sx={{ fontSize: 30, mr: 1, color: 'secondary.main' }} />
              <Typography variant="h6">Preferences</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
              label="Dark Mode"
            />
            <Typography variant="body2" color="text.secondary" mb={2}>
              Switch between light and dark theme.
            </Typography>
            <FormControlLabel control={<Switch defaultChecked />} label="Compact Layout" />
            <Typography variant="body2" color="text.secondary" mb={2}>
              Reduce spacing and margins for more content visibility.
            </Typography>
          </Box>
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 5 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          ⚙️ Settings
        </Typography>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box>{renderStepContent(activeStep)}</Box>

        {/* Navigation Buttons */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleFinish}>
              Finish
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
