import { useState } from "react";
import Navbar from "./shared/Navbar";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  Skeleton,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from "@mui/material";
import {
  Search,
  LocationOn,
  Business,
  AttachMoney,
  Work,
  Schedule,
  TrendingUp,
  FilterList
} from "@mui/icons-material";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const daysAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const Browse = () => {
  const [filters, setFilters] = useState({ 
    q: "", 
    location: "", 
    experience: "", 
    salary: "" 
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { jobs, loading, error, hasMore } = useGetAllJobs(filters, page, 10);

  const handleSearch = (e) => {
    setFilters({ ...filters, q: e.target.value });
    setPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPage(1);
  };

  const popularSearches = [
    "Software Developer", "React JS", "Node.js", "UI/UX Designer", 
    "Project Manager", "Data Analyst", "DevOps Engineer"
  ];

  const popularLocations = [
    "Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "Chennai", "Gurgaon"
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 2 }}>
        {/* Hero Section */}
        <Box sx={{ 
          bgcolor: "#0d47a1", 
          color: "white", 
          py: 6, 
          textAlign: "center",
          background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)"
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Find Your Dream Job Now
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Discover the best opportunities from top companies
          </Typography>
          
          {/* Main Search */}
          <Box sx={{ 
            maxWidth: 800, 
            mx: "auto", 
            bgcolor: "white", 
            borderRadius: 2, 
            p: 1, 
            boxShadow: 3,
            display: "flex",
            alignItems: "center"
          }}>
            <Search sx={{ color: "#757575", ml: 1, mr: 1 }} />
            <TextField
              fullWidth
              placeholder="Enter skills / designations / companies"
              value={filters.q}
              onChange={handleSearch}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ mr: 1 }}
            />
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: "#ff8f00", 
                color: "white", 
                fontWeight: "bold", 
                px: 3,
                borderRadius: 2,
                "&:hover": { bgcolor: "#ff6f00" }
              }}
            >
              Search
            </Button>
          </Box>

          {/* Popular Searches */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
            {popularSearches.map((search, idx) => (
              <Chip
                key={idx}
                label={search}
                variant="outlined"
                sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", cursor: "pointer" }}
                onClick={() => handleFilterChange("q", search)}
              />
            ))}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, mt: -3 }}>
          <Grid container spacing={3}>
            {/* Filters Sidebar */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Filters
                  </Typography>
                  <IconButton size="small">
                    <FilterList />
                  </IconButton>
                </Box>
                <Divider />
                
                <Box sx={{ p: 2 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={filters.location}
                      label="Location"
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                    >
                      <MenuItem value="">Any Location</MenuItem>
                      {popularLocations.map((loc, idx) => (
                        <MenuItem key={idx} value={loc}>{loc}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Experience</InputLabel>
                    <Select
                      value={filters.experience}
                      label="Experience"
                      onChange={(e) => handleFilterChange("experience", e.target.value)}
                    >
                      <MenuItem value="">Any Experience</MenuItem>
                      <MenuItem value="0-2">0-2 years</MenuItem>
                      <MenuItem value="2-5">2-5 years</MenuItem>
                      <MenuItem value="5-10">5-10 years</MenuItem>
                      <MenuItem value="10+">10+ years</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Salary</InputLabel>
                    <Select
                      value={filters.salary}
                      label="Salary"
                      onChange={(e) => handleFilterChange("salary", e.target.value)}
                    >
                      <MenuItem value="">Any Salary</MenuItem>
                      <MenuItem value="0-5">0-5 LPA</MenuItem>
                      <MenuItem value="5-10">5-10 LPA</MenuItem>
                      <MenuItem value="10-20">10-20 LPA</MenuItem>
                      <MenuItem value="20+">20+ LPA</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Card>

              {/* Premium Banner */}
              <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 2, bgcolor: "#fff8e1", border: "1px solid #ffd54f" }}>
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <TrendingUp sx={{ color: "#ff8f00", fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Premium Jobs
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Get exclusive access to premium job listings
                  </Typography>
                  <Button variant="contained" sx={{ bgcolor: "#ff8f00", color: "white", fontWeight: "bold" }}>
                    Upgrade Now
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Jobs List */}
            <Grid item xs={12} md={9}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {jobs.length} Jobs Available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sorted by: <b>Most Relevant</b>
                </Typography>
              </Box>

              {loading && page === 1 ? (
                Array.from(new Array(4)).map((_, index) => (
                  <Card key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent sx={{ display: "flex", p: 3 }}>
                      <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="40%" height={30} />
                        <Skeleton variant="text" width="60%" height={25} />
                        <Skeleton variant="text" width="80%" height={25} />
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Skeleton variant="rounded" width={80} height={30} />
                          <Skeleton variant="rounded" width={80} height={30} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <Card sx={{ p: 3, textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
                  <Typography color="error" variant="h6">
                    ❌ Failed to load jobs
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Try Again
                  </Button>
                </Card>
              ) : jobs.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    No jobs found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or search terms
                  </Typography>
                </Card>
              ) : (
                <>
                  {jobs.map((job) => (
                    <Card key={job._id} sx={{ mb: 2, borderRadius: 2, boxShadow: 3, "&:hover": { boxShadow: 6 } }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex" }}>
                          <Avatar
                            src={job.company?.logo}
                            sx={{ width: 60, height: 60, mr: 2, bgcolor: "#e3f2fd" }}
                          >
                            <Business />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              {job.title}
                            </Typography>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                              <Business sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }} />
                              {job.company?.name}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                              <Chip 
                                icon={<LocationOn />} 
                                label={job.location || "Remote"} 
                                size="small" 
                                variant="outlined" 
                              />
                              <Chip 
                                icon={<AttachMoney />} 
                                label={job.salary || "Not specified"} 
                                size="small" 
                                variant="outlined" 
                              />
                              <Chip 
                                icon={<Work />} 
                                label={job.experience || "Any experience"} 
                                size="small" 
                                variant="outlined" 
                              />
                              <Chip 
                                icon={<Schedule />} 
                                label={`${daysAgo(job.createdAt)}d ago`} 
                                size="small" 
                                variant="outlined" 
                              />
                            </Box>
                            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {job.skills?.slice(0, 4).map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill}
                                  size="small"
                                  sx={{ bgcolor: "#e3f2fd", color: "primary.main" }}
                                />
                              ))}
                              {job.skills?.length > 4 && (
                                <Chip
                                  label={`+${job.skills.length - 4} more`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <Button
                              variant="contained"
                              sx={{ 
                                bgcolor: "#ff8f00", 
                                color: "white", 
                                fontWeight: "bold", 
                                mb: 1,
                                "&:hover": { bgcolor: "#ff6f00" }
                              }}
                            >
                              Apply Now
                            </Button>
                            <Button variant="outlined" size="small">
                              Save
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Load More */}
                  {hasMore && (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                      <Button
                        variant="outlined"
                        sx={{ 
                          px: 4, 
                          py: 1, 
                          fontWeight: "bold",
                          borderColor: "primary.main",
                          color: "primary.main"
                        }}
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Load More Jobs"}
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Browse;