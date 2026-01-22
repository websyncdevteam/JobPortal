import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';

const PipelineChart = ({ jobs }) => {
  const theme = useTheme();

  // Prepare data for the chart - group by status
  const statusData = jobs.reduce((acc, job) => {
    Object.entries(job.candidateCounts || {}).forEach(([status, count]) => {
      if (!acc[status]) {
        acc[status] = {
          name: status.charAt(0).toUpperCase() + status.slice(1),
          count: 0,
        };
      }
      acc[status].count += count;
    });
    return acc;
  }, {});

  const chartData = Object.values(statusData);

  // Colors for different statuses
  const statusColors = {
    applied: theme.palette.primary.main,
    reviewed: theme.palette.info.main,
    interviewing: theme.palette.warning.main,
    offered: theme.palette.success.main,
    hired: theme.palette.success.dark,
    rejected: theme.palette.error.main,
  };

  return (
    <Box sx={{ height: 300, mt: 2 }}>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} candidates`, 'Count']}
              labelFormatter={(value) => `Status: ${value}`}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Candidates"
              fill={theme.palette.primary.main}
            >
              {chartData.map((entry, index) => (
                <Bar 
                  key={`bar-${index}`}
                  dataKey="count"
                  fill={statusColors[entry.name.toLowerCase()] || theme.palette.primary.main}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          height="100%"
        >
          <Typography variant="body2" color="textSecondary">
            No candidate data available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PipelineChart;