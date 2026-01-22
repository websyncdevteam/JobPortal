import { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "./shared/Navbar";
import CategoryCarousel from "./CategoryCarousel";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Building,
  Users,
  Target,
  Shield,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  ArrowRight,
  Phone,
  Mail,
  Linkedin,
  Sparkles,
  Rocket,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showSparkles, setShowSparkles] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const location = useLocation();

  const { refetch } = useGetAllJobs();

  const stats = useMemo(() => {
    if (!allJobs || allJobs.length === 0) return null;

    const companies = [
      ...new Set(allJobs.map((job) => job.company?.name).filter(Boolean)),
    ];
    const urgentJobs = allJobs.filter((job) => job.urgent === true).length;
    const remoteJobs = allJobs.filter(
      (job) =>
        job.location?.toLowerCase().includes("remote") ||
        job.workType?.toLowerCase().includes("remote")
    ).length;

    return {
      totalJobs: allJobs.length,
      totalCompanies: companies.length,
      urgentJobs,
      remoteJobs,
    };
  }, [allJobs]);

  const filterJobs = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredJobs(allJobs.slice(0, 6));
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allJobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(query) ||
        job.company?.name?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.category?.toLowerCase().includes(query)
    );
    setFilteredJobs(filtered.slice(0, 6));
  }, [searchQuery, allJobs]);

  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  useEffect(() => {
    if (user && location.state?.fromAuth) {
      let targetRoute = "/profile";
      if (user.role === "recruiter") targetRoute = "/admin/jobs";
      if (user.role === "admin") targetRoute = "/admin/users";
      if (location.pathname !== targetRoute) {
        navigate(targetRoute, { replace: true, state: {} });
      }
    }
  }, [user, navigate, location]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    const sparkleTimer = setTimeout(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 2000);
    }, 1500);
    return () => {
      clearTimeout(timer);
      clearTimeout(sparkleTimer);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Featured Companies
  const featuredCompanies = [
    { name: "TechCorp", logo: "🏢", jobs: 12 },
    { name: "Global Inc", logo: "🌐", jobs: 8 },
    { name: "Innovate Ltd", logo: "💡", jobs: 15 },
    { name: "Digital Co", logo: "📱", jobs: 7 },
    { name: "Future Group", logo: "🚀", jobs: 10 },
    { name: "Growth Partners", logo: "📈", jobs: 9 },
  ];

  // Job Card Component
  const JobCard = ({ job, index }) => {
    const handleJobClick = () => {
      const jobId = job._id || job.id;
      if (jobId) {
        navigate(`/description/${jobId}`);
      } else {
        navigate("/jobs");
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: index * 0.15,
          duration: 0.5,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
        className="group relative"
      >
        {/* Gradient border effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#13419E] via-[#119FE6] to-[#72BBE8] rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>

        <div className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col z-0 overflow-hidden">
          {/* Animated background element */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.05 }}
            transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
            className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#13419E]/20 to-[#119FE6]/20"
          />

          <div className="flex items-start justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden border border-gray-200"
              >
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Building className="w-6 h-6 text-gray-600" />
                )}
              </motion.div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium text-sm mt-1">
                  {job.company?.name}
                </p>
              </div>
            </div>
            {job.urgent && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                className="px-3 py-1 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 rounded-full text-xs font-semibold border border-red-200 flex items-center gap-1"
              >
                <Zap size={10} />
                Urgent
              </motion.span>
            )}
          </div>

          <div className="space-y-4 flex-1 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MapPin size={14} className="text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">
                  {job.location || "Remote"}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <DollarSign size={14} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-600">
                  {job.salary || "Negotiable"}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + 0.3 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Briefcase size={14} className="text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">
                  {job.jobType || "Full-time"}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + 0.4 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Calendar size={14} className="text-orange-600" />
                </div>
                <span className="text-sm text-gray-600">
                  {job.experience || "Any"}
                </span>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.5 }}
            className="pt-6 mt-6 border-t border-gray-100 relative z-10"
          >
            <motion.button
              onClick={handleJobClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-gradient-to-r from-[#13419E] to-[#119FE6] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              <span>View Details</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight size={16} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <div className="h-[600px] bg-gradient-to-b from-[#13419E]/5 to-white">
            <div className="max-w-7xl mx-auto px-6 pt-32">
              <div className="h-12 bg-gray-200 rounded-xl w-3/4 max-w-2xl mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 max-w-xl mb-10"></div>
              <div className="h-16 bg-gray-300 rounded-2xl w-full max-w-3xl"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Floating Rocket Animation */}
        <AnimatePresence>
          {showSparkles && (
            <motion.div
              initial={{ x: -100, y: -100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ x: 100, y: -100, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="fixed top-4 right-4 z-50"
            >
              <Rocket className="w-8 h-8 text-[#13419E] animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-[#13419E]/5 via-white to-white overflow-hidden">
          {/* Animated background circles */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-[#13419E]/10 to-[#119FE6]/10 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              rotate: [0, -360, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#72BBE8]/10 to-[#CCE4F4]/10 blur-3xl"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-32 relative z-10">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Career,
                  <br />
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="relative inline-block"
                  >
                    <span className="text-[#13419E]">Our</span>
                    <span className="text-[#FE0303] ml-4">Expertise</span>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#13419E] via-[#119FE6] to-[#72BBE8]"
                    />
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light"
                >
                  Direct connections with 500+ top companies. We bridge talent
                  with opportunity through strategic recruitment partnerships.
                </motion.p>
              </motion.div>

              {/* Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
                onSubmit={handleSearch}
                className="max-w-3xl mx-auto mb-16"
              >
                <div className="relative">
                  <motion.div
                    animate={{ opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-[#13419E] to-[#119FE6] rounded-2xl blur-lg"
                  />
                  <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center px-4">
                      <Search className="text-gray-400 ml-2" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jobs, skills, or companies..."
                        className="flex-1 px-4 py-6 text-lg border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="m-2 px-8 py-3 bg-gradient-to-r from-[#13419E] to-[#119FE6] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Search
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {[
                    "Software Engineer",
                    "Marketing",
                    "Remote",
                    "Urgent Hiring",
                    "Finance",
                    "Design",
                  ].map((tag, i) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-[#13419E] hover:text-[#13419E] hover:bg-[#13419E]/5 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </motion.form>

              {/* Stats */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                >
                  {[
                    {
                      value: stats.totalJobs,
                      label: "Active Jobs",
                      color: "text-[#13419E]",
                    },
                    {
                      value: stats.totalCompanies,
                      label: "Partner Companies",
                      color: "text-[#119FE6]",
                    },
                    {
                      value: stats.urgentJobs,
                      label: "Urgent Positions",
                      color: "text-[#72BBE8]",
                    },
                    {
                      value: stats.remoteJobs,
                      label: "Remote Roles",
                      color: "text-[#FE0303]",
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="text-center"
                    >
                      <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                        {stat.value}+
                      </div>
                      <div className="text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Trusted Companies */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We maintain exclusive recruitment partnerships with top
                companies across sectors
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {featuredCompanies.map((company, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-gray-100 text-center hover:border-[#119FE6]/30 hover:shadow-md transition-all"
                >
                  <div className="text-3xl mb-3">{company.logo}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {company.name}
                  </h3>
                  <p className="text-sm text-[#13419E] font-medium">
                    {company.jobs} openings
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How <span className="text-[#13419E]">AIM9HIRE</span> Works
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                We're not just another job portal. We're strategic recruitment
                partners with direct company connections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl border border-gray-100 hover:border-[#13419E]/20 hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#13419E]/10 to-[#119FE6]/10 flex items-center justify-center mb-6">
                  <Building className="w-8 h-8 text-[#13419E]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Direct Company Access
                </h3>
                <p className="text-gray-600">
                  Exclusive partnerships with 500+ companies who trust us with
                  their hiring needs.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-gray-100 hover:border-[#13419E]/20 hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#119FE6]/10 to-[#72BBE8]/10 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-[#119FE6]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Strategic Matching
                </h3>
                <p className="text-gray-600">
                  We understand company culture and candidate profiles for
                  perfect placements.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-gray-100 hover:border-[#13419E]/20 hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FE0303]/10 to-[#FF6B6B]/10 flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-[#FE0303]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Priority Consideration
                </h3>
                <p className="text-gray-600">
                  Applications through AIM9HIRE get priority review by our
                  partner companies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Jobs - THIS IS WHERE THE JOB CARDS ARE */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Latest <span className="text-[#13419E]">Opportunities</span>
                </h2>
                <p className="text-gray-600">
                  Curated openings from our partner companies
                </p>
              </div>

              <button
                onClick={() => navigate("/jobs")}
                className="px-6 py-3 bg-white border-2 border-[#13419E] text-[#13419E] rounded-xl font-semibold hover:bg-[#13419E]/5 transition-colors flex items-center gap-2"
              >
                View All Jobs
                <ArrowRight size={18} />
              </button>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <Search className="text-gray-400" size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? `Try different keywords`
                    : "New opportunities coming soon"}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-bold text-purple-700">
                      {filteredJobs.length}
                    </span>{" "}
                    of <span className="font-bold">{allJobs.length}</span> jobs
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>

                {/* JOB CARDS GRID - HERE ARE THE JOB CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job, index) => (
                    <JobCard
                      key={job._id || job.id || index}
                      job={job}
                      index={index}
                    />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <button
                    onClick={() => navigate("/jobs")}
                    className="px-8 py-4 bg-gradient-to-r from-[#13419E] to-[#119FE6] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity text-lg"
                  >
                    Explore All {allJobs.length} Opportunities
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Browse by <span className="text-[#13419E]">Industry</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find opportunities in your area of expertise
              </p>
            </div>
            <CategoryCarousel />
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#13419E] via-[#119FE6] to-[#72BBE8]"></div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to accelerate your career?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
              Join thousands of professionals who found their dream roles
              through our exclusive company connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-4 bg-white text-[#13419E] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-2xl text-lg"
                  >
                    Start Your Journey
                  </button>
                  <button
                    onClick={() => navigate("/join-freelancer")}
                    className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-[#13419E] transition-colors text-lg"
                  >
                    Join as Freelancer
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/jobs")}
                  className="px-8 py-4 bg-white text-[#13419E] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-2xl text-lg"
                >
                  Browse All Opportunities
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
