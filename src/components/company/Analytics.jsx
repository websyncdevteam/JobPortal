import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  alpha,
  useTheme,
  Fade,
  Slide,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  People,
  BusinessCenter,
  AttachMoney,
  Refresh,
  Download,
  FilterList,
  DateRange,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import workflowService from '../../services/companyservice/workflowService'; // ✅ CHANGED TO DEFAULT IMPORT
import { format } from 'date-fns';

// Premium KPI Card Component
const KPICard = ({ title, value, change, icon, color, loading = false, format = 'number' }) => {
  const theme = useTheme();
  
  const formatValue = (val) => {
    if (format === 'percentage') return `${val}%`;
    if (format === 'currency') return `$${val.toLocaleString()}`;
    return val.toLocaleString();
  };

  return (
    <Slide direction="up" in={!loading} timeout={300}>
      <Card 
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
          transition: 'all 0.3s ease',
          height: '100%',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4],
            borderColor: alpha(color, 0.3),
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box flex={1}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  mb: 1 
                }}
              >
                {title}
              </Typography>
              
              {loading ? (
                <Box display="flex" alignItems="center" height={40}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      lineHeight: 1.2,
                      mb: 1 
                    }}
                  >
                    {formatValue(value)}
                  </Typography>
                  
                  {change !== undefined && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        size="small"
                        icon={<TrendingUp sx={{ fontSize: 14 }} />}
                        label={`${change > 0 ? '+' : ''}${change}%`}
                        sx={{
                          backgroundColor: change >= 0 
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                          color: change >= 0 
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        vs last month
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
            
            <Box
              sx={{
                backgroundColor: alpha(color, 0.1),
                color: color,
                p: 1.5,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ml: 2,
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 24 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Slide>
  );
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper 
        elevation={3}
        sx={{ 
          p: 2, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  backgroundColor: entry.color 
                }} 
              />
              <Typography variant="body2" color="text.secondary">
                {entry.name}:
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={600}>
              {entry.value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

const Analytics = () => {
  const theme = useTheme();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');

  const fetchAnalytics = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);
    
    try {
      // Add small delay to ensure auth context is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Debug: Check auth status
      const authStatus = await workflowService.debugAuthStatus(); // ✅ CHANGED TO workflowService
      console.log('🔍 Auth status before fetch:', authStatus);
      
      const data = await workflowService.getAnalytics({ period: timeRange }); // ✅ CHANGED TO workflowService
      setAnalyticsData(data);
      setError('');
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Unable to load analytics data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Handle time range change
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  // Export data
  const handleExport = () => {
    console.log('Exporting analytics data...');
  };

  // Process analytics data for charts
  const processChartData = () => {
    if (!analyticsData) return null;

    // Applications trend
    const applicationsTrend = analyticsData.applicationTrend?.map(item => ({
      date: format(new Date(item._id), 'MMM dd'),
      applications: item.count,
    })) || [];

    // Status distribution
    const statusDistribution = analyticsData.statusCounts ? 
      Object.entries(analyticsData.statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
          value: count,
          percentage: (count / Object.values(analyticsData.statusCounts).reduce((a, b) => a + b, 0)) * 100,
        }))
        .sort((a, b) => b.value - a.value) : [];

    // Job performance
    const jobPerformance = analyticsData.jobPerformance?.map(job => ({
      name: job.jobTitle.length > 20 ? job.jobTitle.substring(0, 20) + '...' : job.jobTitle,
      applicants: job.totalApplications,
      hired: job.hired,
      conversion: job.hireRate,
    })) || [];

    return {
      applicationsTrend,
      statusDistribution,
      jobPerformance,
    };
  };

  const chartData = processChartData();

  // Color palette
  const colors = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    secondary: theme.palette.secondary.main,
  };

  const chartColors = [
    colors.primary,
    colors.success,
    colors.warning,
    colors.error,
    colors.info,
    colors.secondary,
  ];

  // Time range options
  const timeRanges = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' },
  ];

  if (error && !analyticsData) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchAnalytics()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Fade in={!loading} timeout={500}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight={600}
                sx={{ 
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive insights into your recruitment performance
              </Typography>
            </Box>
            
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => fetchAnalytics(false)}
                disabled={refreshing}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
          </Box>

          {/* Time Range Selector */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 1.5, 
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: 'inline-flex',
              gap: 0.5,
            }}
          >
            {timeRanges.map((range) => (
              <Chip
                key={range.value}
                label={range.label}
                onClick={() => handleTimeRangeChange(range.value)}
                variant={timeRange === range.value ? "filled" : "outlined"}
                color={timeRange === range.value ? "primary" : "default"}
                size="small"
                sx={{ borderRadius: 2, fontWeight: 500 }}
              />
            ))}
          </Paper>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* KPI Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Applications"
              value={analyticsData?.overview?.totalApplications || 0}
              change={analyticsData?.overview?.applicationGrowth || 0}
              icon={<People />}
              color={colors.primary}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Active Jobs"
              value={analyticsData?.overview?.activeJobs || 0}
              change={12.5}
              icon={<BusinessCenter />}
              color={colors.success}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Conversion Rate"
              value={analyticsData?.overview?.applicationGrowth || 0}
              change={analyticsData?.overview?.applicationGrowth > 0 ? 8.5 : -3.2}
              icon={<TrendingUp />}
              color={colors.warning}
              loading={loading}
              format="percentage"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Avg Time to Hire"
              value={analyticsData?.overview?.avgTimeToHire || 24}
              change={-5.2}
              icon={<DateRange />}
              color={colors.info}
              loading={loading}
              format="number"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Applications Trend */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                height: '100%',
                minHeight: 400,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={600}>
                  Applications Trend
                </Typography>
                <Chip
                  icon={<TrendingUp sx={{ fontSize: 16 }} />}
                  label={`${analyticsData?.overview?.applicationGrowth || 0}% growth`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <CircularProgress />
                </Box>
              ) : chartData?.applicationsTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.applicationsTrend}>
                    <defs>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={alpha(theme.palette.divider, 0.3)}
                    />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke={colors.primary}
                      strokeWidth={2}
                      fill="url(#colorApplications)"
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ strokeWidth: 2, r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={300}>
                  <AnalyticsIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No application data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Status Distribution */}
          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                height: '100%',
                minHeight: 400,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={3}>
                Candidate Status Distribution
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <CircularProgress />
                </Box>
              ) : chartData?.statusDistribution?.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.statusDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={chartColors[index % chartColors.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} candidates`, name]}
                        contentStyle={{ borderRadius: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={300}>
                  <People sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No candidate status data</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Job Performance */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                minHeight: 400,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={3}>
                Job Performance
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <CircularProgress />
                </Box>
              ) : chartData?.jobPerformance?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.jobPerformance}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={alpha(theme.palette.divider, 0.3)}
                    />
                    <XAxis 
                      dataKey="name" 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="applicants" 
                      name="Total Applicants" 
                      fill={colors.primary} 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="hired" 
                      name="Hired Candidates" 
                      fill={colors.success} 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={300}>
                  <BusinessCenter sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No job performance data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Last Updated */}
        {analyticsData && (
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {analyticsData.fetchedAt ? 
                format(new Date(analyticsData.fetchedAt), 'MMM dd, yyyy HH:mm') : 
                'Just now'}
            </Typography>
          </Box>
        )}
      </Container>
    </Fade>
  );
};

export default Analytics;