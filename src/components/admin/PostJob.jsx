// src/components/admin/PostJob.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import api from "../../services/api"; // ✅ use shared axios instance
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Fade,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  WorkOutline,
  LocationOn,
  AttachMoney,
  Code,
  Business,
  Description,
  TrendingFlat,
} from "@mui/icons-material";
import { toast } from "sonner";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a custom theme with black and orange
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
    },
    secondary: {
      main: "#FF8C00",
      light: "#FFA733",
      dark: "#CC7000",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
      color: "#000000",
    },
    h5: {
      fontWeight: 600,
      color: "#000000",
    },
    h6: {
      color: "#666666",
    },
    body1: {
      color: "#333333",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            backgroundColor: "#FFFFFF",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          border: "1px solid #E0E0E0",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    companyId: "",
    location: "",
    skillsInput: "",
    salary: "",
    experience: "",
    jobType: "Full-time",
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];

  // Fetch companies using the shared api instance
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = user?.token || localStorage.getItem("authToken");
        if (!token) {
          toast.error("You are not authorized to fetch companies.");
          return;
        }

        // ✅ Use api.get with relative path – api already includes baseURL and token header
        const res = await api.get("/admin/companies");

        if (res.data.success) {
          setCompanies(res.data.data);
        } else {
          toast.error("Failed to fetch companies");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching companies. Check console.");
      }
    };

    fetchCompanies();
  }, [user]);

  const handleChange = (e) => {
    if (e.target.name === "skillsInput") {
      setForm((prev) => ({ ...prev, skillsInput: e.target.value }));
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const addSkill = () => {
    if (form.skillsInput.trim() && !skills.includes(form.skillsInput.trim())) {
      setSkills([...skills, form.skillsInput.trim()]);
      setForm((prev) => ({ ...prev, skillsInput: "" }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.companyId) {
      toast.error("Please select a company");
      return;
    }

    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: form.title,
        description: form.description,
        company: form.companyId,
        location: form.location,
        skills: skills,
        salary: form.salary,
        experience: form.experience,
        jobType: form.jobType,
      };

      const endpoint = user?.role === "admin" ? "/admin/jobs" : "/recruiter/jobs";

      const res = await api.post(endpoint, payload);

      if (res.data.success) {
        toast.success(res.data.message || "Job posted successfully");
        navigate(user?.role === "admin" ? "/admin/jobs" : "/recruiter/jobs");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        background: "#F5F5F5", 
        minHeight: "100vh", 
        py: isMobile ? 2 : 4,
        px: isMobile ? 1 : 2
      }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ 
            maxWidth: 1000, 
            margin: "0 auto",
            px: isMobile ? 1 : 3
          }}>
            {/* Header with back button */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <IconButton 
                onClick={() => navigate(-1)}
                sx={{ 
                  color: "primary.main", 
                  mr: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={700}>
                Post a New Job
              </Typography>
            </Box>

            <Paper sx={{ 
              borderRadius: 2, 
              overflow: "hidden",
            }}>
              <Box sx={{ 
                background: "secondary.main", 
                color: "white", 
                py: 2, 
                px: 4,
                display: "flex",
                alignItems: "center"
              }}>
                <WorkOutline sx={{ mr: 1, fontSize: "28px" }} />
                <Typography variant="h5" fontWeight={600}>
                  Job Details
                </Typography>
              </Box>

              <Box sx={{ p: isMobile ? 2 : 4 }}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Job Title & Company */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="title"
                        label="Job Title"
                        fullWidth
                        value={form.title}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <WorkOutline sx={{ mr: 1, opacity: 0.7, color: "text.secondary" }} />
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel id="company-label">Select Company</InputLabel>
                        <Select
                          name="companyId"
                          labelId="company-label"
                          label="Select Company"
                          value={form.companyId}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          startAdornment={
                            <Business sx={{ mr: 1, opacity: 0.7, color: "text.secondary" }} />
                          }
                        >
                          {companies.map((c) => (
                            <MenuItem key={c._id} value={c._id}>
                              {c.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                      <TextField
                        name="description"
                        label="Job Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <Description sx={{ mr: 1, opacity: 0.7, color: "text.secondary", alignSelf: "flex-start", mt: 1 }} />
                          ),
                        }}
                      />
                    </Grid>

                    {/* Location & Job Type */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="location"
                        label="Location"
                        fullWidth
                        value={form.location}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <LocationOn sx={{ mr: 1, opacity: 0.7, color: "text.secondary" }} />
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel id="job-type-label">Job Type</InputLabel>
                        <Select
                          name="jobType"
                          labelId="job-type-label"
                          label="Job Type"
                          value={form.jobType}
                          onChange={handleChange}
                          variant="outlined"
                        >
                          {jobTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Skills */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="skillsInput"
                        label="Add Skills"
                        fullWidth
                        value={form.skillsInput}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <Code sx={{ mr: 1, opacity: 0.7, color: "text.secondary" }} />
                          ),
                          endAdornment: (
                            <Button 
                              onClick={addSkill}
                              sx={{ 
                                color: "secondary.main",
                                fontSize: "12px",
                                minWidth: "auto",
                                fontWeight: 600
                              }}
                            >
                              Add
                            </Button>
                          )
                        }}
                      />
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                        {skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            onDelete={() => removeSkill(skill)}
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 1, backgroundColor: "#F0F0F0" }}
                          />
                        ))}
                      </Box>
                    </Grid>

                    {/* Salary & Experience */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="salary"
                        label="Salary"
                        fullWidth
                        value={form.salary}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <AttachMoney sx={{ mr: 1, opacity: 0.7, color: "text.secondary" }} />
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        name="experience"
                        label="Experience (e.g., 2-4 years)"
                        fullWidth
                        value={form.experience}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>

                    {/* Submit */}
                    <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <TrendingFlat />}
                        sx={{
                          px: 6,
                          py: 1.5,
                          fontSize: "1rem",
                          backgroundColor: "secondary.main",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "secondary.dark",
                          }
                        }}
                      >
                        {loading ? "Posting Job..." : "Publish Job"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default PostJob;
