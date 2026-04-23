// src/components/admin/PostJob.jsx - Enhanced with more fields and ₹ currency
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
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
  Divider,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Tooltip,
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
  Category,
  People,
  CalendarToday,
  Email,
  Phone,
  Flag,
  Star,
  HelpOutline,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "sonner";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme (keep your existing or enhance)
const theme = createTheme({
  palette: {
    primary: { main: "#2563eb" },
    secondary: { main: "#8b5cf6" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#1e293b", secondary: "#64748b" },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#ffffff",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

// Industry options
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Media",
  "Real Estate",
  "Transportation",
  "Other",
];

// Work modes
const workModes = [
  { value: "onsite", label: "On‑site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

// Job types
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

// Experience levels
const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (2-5 years)" },
  { value: "senior", label: "Senior Level (5-8 years)" },
  { value: "lead", label: "Lead / Manager (8+ years)" },
];

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [perks, setPerks] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    companyId: "",
    location: "",
    skillsInput: "",
    perksInput: "",
    tagsInput: "",
    salary: "",
    experience: "",
    jobType: "Full-time",
    workMode: "onsite",
    experienceLevel: "mid",
    category: "",
    industry: "",
    vacancies: 1,
    deadline: null,
    contactEmail: "",
    contactPhone: "",
    urgent: false,
    featured: false,
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchCompanies = async () => {
    try {
      const token = user?.token || localStorage.getItem("authToken");
      if (!token) {
        toast.error("You are not authorized to fetch companies.");
        return;
      }
      let url = "/admin/companies";
      if (user?.role !== "admin") {
        url = "/team/companies";
      }
      const res = await api.get(url);
      if (res.data.success) {
        setCompanies(res.data.data);
      } else {
        if (res.data.message === "No companies found.") {
          setCompanies([]);
        } else {
          toast.error("Failed to fetch companies");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404 && err.response?.data?.message === "No team found") {
        setCompanies([]);
      } else {
        toast.error("Error fetching companies. Check console.");
      }
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addSkill = () => {
    if (form.skillsInput.trim() && !skills.includes(form.skillsInput.trim())) {
      setSkills([...skills, form.skillsInput.trim()]);
      setForm((prev) => ({ ...prev, skillsInput: "" }));
    }
  };

  const addPerk = () => {
    if (form.perksInput.trim() && !perks.includes(form.perksInput.trim())) {
      setPerks([...perks, form.perksInput.trim()]);
      setForm((prev) => ({ ...prev, perksInput: "" }));
    }
  };

  const addTag = () => {
    if (form.tagsInput.trim() && !tags.includes(form.tagsInput.trim())) {
      setTags([...tags, form.tagsInput.trim()]);
      setForm((prev) => ({ ...prev, tagsInput: "" }));
    }
  };

  const removeItem = (setter, item) => {
    setter((prev) => prev.filter((i) => i !== item));
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
        workMode: form.workMode,
        experienceLevel: form.experienceLevel,
        category: form.category,
        industry: form.industry,
        vacancies: form.vacancies,
        deadline: form.deadline ? dayjs(form.deadline).toISOString() : null,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        urgent: form.urgent,
        featured: form.featured,
        perks: perks,
        tags: tags,
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

  const steps = ["Company & Basic Info", "Job Details", "Requirements & Perks", "Contact & Options"];

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%)", minHeight: "100vh", py: isMobile ? 2 : 4, px: isMobile ? 1 : 2 }}>
          <Fade in={true} timeout={800}>
            <Box sx={{ maxWidth: 1200, margin: "0 auto", px: isMobile ? 1 : 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
                  <ArrowBack />
                </IconButton>
                <Typography variant="h4" fontWeight={800}>Post a New Job</Typography>
              </Box>

              <Paper elevation={3} sx={{ overflow: "hidden" }}>
                <Box sx={{ bgcolor: "primary.main", color: "white", py: 2, px: 4 }}>
                  <Stepper activeStep={activeStep} alternativeLabel sx={{ bgcolor: "transparent" }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel StepIconProps={{ style: { color: "white" } }}>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                <Box sx={{ p: isMobile ? 2 : 4 }}>
                  <form onSubmit={handleSubmit}>
                    {activeStep === 0 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="title"
                            label="Job Title *"
                            fullWidth
                            value={form.title}
                            onChange={handleChange}
                            required
                            InputProps={{ startAdornment: <WorkOutline sx={{ mr: 1, color: "text.secondary" }} /> }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required>
                            <InputLabel id="company-label">Company *</InputLabel>
                            <Select
                              name="companyId"
                              labelId="company-label"
                              label="Company *"
                              value={form.companyId}
                              onChange={handleChange}
                              startAdornment={<Business sx={{ mr: 1, color: "text.secondary" }} />}
                            >
                              {companies.map((c) => (
                                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="category"
                            label="Category (e.g., Software Development)"
                            fullWidth
                            value={form.category}
                            onChange={handleChange}
                            InputProps={{ startAdornment: <Category sx={{ mr: 1, color: "text.secondary" }} /> }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="industry"
                            label="Industry"
                            select
                            fullWidth
                            value={form.industry}
                            onChange={handleChange}
                            InputProps={{ startAdornment: <Business sx={{ mr: 1, color: "text.secondary" }} /> }}
                          >
                            {industries.map((ind) => (
                              <MenuItem key={ind} value={ind}>{ind}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="description"
                            label="Job Description *"
                            fullWidth
                            multiline
                            rows={5}
                            value={form.description}
                            onChange={handleChange}
                            required
                            InputProps={{ startAdornment: <Description sx={{ mr: 1, color: "text.secondary", alignSelf: "flex-start", mt: 1 }} /> }}
                          />
                        </Grid>
                      </Grid>
                    )}

                    {activeStep === 1 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="location"
                            label="Location *"
                            fullWidth
                            value={form.location}
                            onChange={handleChange}
                            required
                            InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: "text.secondary" }} /> }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel id="work-mode-label">Work Mode</InputLabel>
                            <Select
                              name="workMode"
                              labelId="work-mode-label"
                              label="Work Mode"
                              value={form.workMode}
                              onChange={handleChange}
                            >
                              {workModes.map((mode) => (
                                <MenuItem key={mode.value} value={mode.value}>{mode.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel id="job-type-label">Job Type</InputLabel>
                            <Select
                              name="jobType"
                              labelId="job-type-label"
                              label="Job Type"
                              value={form.jobType}
                              onChange={handleChange}
                            >
                              {jobTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel id="exp-level-label">Experience Level</InputLabel>
                            <Select
                              name="experienceLevel"
                              labelId="exp-level-label"
                              label="Experience Level"
                              value={form.experienceLevel}
                              onChange={handleChange}
                            >
                              {experienceLevels.map((level) => (
                                <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            name="vacancies"
                            label="Number of Vacancies"
                            type="number"
                            fullWidth
                            value={form.vacancies}
                            onChange={handleChange}
                            InputProps={{ startAdornment: <People sx={{ mr: 1, color: "text.secondary" }} /> }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="salary"
                            label="Salary (₹ per annum) *"
                            fullWidth
                            value={form.salary}
                            onChange={handleChange}
                            required
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DatePicker
                            label="Application Deadline"
                            value={form.deadline ? dayjs(form.deadline) : null}
                            onChange={(newValue) => setForm({ ...form, deadline: newValue ? newValue.toDate() : null })}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </Grid>
                      </Grid>
                    )}

                    {activeStep === 2 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Required Skills *</Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              name="skillsInput"
                              label="Add a skill (e.g., React)"
                              fullWidth
                              value={form.skillsInput}
                              onChange={handleChange}
                              onKeyPress={(e) => e.key === "Enter" && addSkill()}
                            />
                            <Button onClick={addSkill} variant="contained">Add</Button>
                          </Box>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                            {skills.map((skill) => (
                              <Chip key={skill} label={skill} onDelete={() => removeItem(setSkills, skill)} color="primary" />
                            ))}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Perks & Benefits</Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              name="perksInput"
                              label="Add a perk (e.g., Health Insurance)"
                              fullWidth
                              value={form.perksInput}
                              onChange={handleChange}
                              onKeyPress={(e) => e.key === "Enter" && addPerk()}
                            />
                            <Button onClick={addPerk} variant="outlined">Add</Button>
                          </Box>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                            {perks.map((perk) => (
                              <Chip key={perk} label={perk} onDelete={() => removeItem(setPerks, perk)} />
                            ))}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Tags (optional)</Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              name="tagsInput"
                              label="Add a tag (e.g., Urgent, Remote)"
                              fullWidth
                              value={form.tagsInput}
                              onChange={handleChange}
                              onKeyPress={(e) => e.key === "Enter" && addTag()}
                            />
                            <Button onClick={addTag} variant="outlined">Add</Button>
                          </Box>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                            {tags.map((tag) => (
                              <Chip key={tag} label={tag} onDelete={() => removeItem(setTags, tag)} />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    {activeStep === 3 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="contactEmail"
                            label="Contact Email"
                            type="email"
                            fullWidth
                            value={form.contactEmail}
                            onChange={handleChange}
                            InputProps={{ startAdornment: <Email sx={{ mr: 1, color: "text.secondary" }} /> }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="contactPhone"
                            label="Contact Phone"
                            fullWidth
                            value={form.contactPhone}
                            onChange={handleChange}
                            InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: "text.secondary" }} /> }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={<Checkbox name="urgent" checked={form.urgent} onChange={handleChange} />}
                            label={<Box sx={{ display: "flex", alignItems: "center" }}><Flag sx={{ mr: 1, color: "red" }} /> Mark as Urgent Hiring</Box>}
                          />
                          <FormControlLabel
                            control={<Checkbox name="featured" checked={form.featured} onChange={handleChange} />}
                            label={<Box sx={{ display: "flex", alignItems: "center" }}><Star sx={{ mr: 1, color: "gold" }} /> Feature this Job (highlighted)</Box>}
                          />
                        </Grid>
                      </Grid>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                      <Button disabled={activeStep === 0} onClick={prevStep}>Back</Button>
                      {activeStep < steps.length - 1 ? (
                        <Button variant="contained" onClick={nextStep}>Next</Button>
                      ) : (
                        <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <TrendingFlat />}>
                          {loading ? "Posting..." : "Publish Job"}
                        </Button>
                      )}
                    </Box>
                  </form>
                </Box>
              </Paper>
            </Box>
          </Fade>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default PostJob;
