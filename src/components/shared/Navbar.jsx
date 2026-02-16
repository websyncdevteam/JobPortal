// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User2,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Heart,
  Home,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import api from "@/services/api"; // ✅ Use central API
import { toast } from "sonner";
import Logo from "../../assets/3.png";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function using central api
  const logoutHandler = async () => {
    try {
      const res = await api.get("/user/logout"); // relative to baseURL
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message);
        setUserDropdownOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const goToDashboard = () => {
    navigate("/freelancer/dashboard");
    setUserDropdownOpen(false);
  };

  const goToProfile = () => {
    navigate("/freelancer/profile");
    setUserDropdownOpen(false);
  };

  const goToCandidateProfile = () => {
    navigate("/profile");
    setUserDropdownOpen(false);
  };

  const getUserInitials = () => {
    if (!user?.fullname) return "U";
    return user.fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserFirstName = () => {
    if (!user?.fullname) return "User";
    return user.fullname.split(" ")[0];
  };

  const getProfilePicture = () => {
    if (!user) return null;
    return (
      user.profile?.profilePhoto ||
      user.uploadedProfilePicture ||
      user.profilePicture ||
      null
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg transition-transform hover:scale-105"
              aria-label="Go to homepage"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-lg shadow-sm">
                <img
                  src={Logo}
                  alt="Company Logo"
                  className="w-full h-full object-contain p-2"
                  loading="eager"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors hover:text-purple-600 flex items-center gap-2 ${
                location.pathname === "/" ? "text-purple-600 font-semibold" : "text-gray-700"
              }`}
            >
              <Home size={18} />
              Home
            </Link>
            <Link
              to="/jobs"
              className={`font-medium transition-colors hover:text-purple-600 flex items-center gap-2 ${
                location.pathname === "/jobs" ? "text-purple-600 font-semibold" : "text-gray-700"
              }`}
            >
              <Briefcase size={18} />
              Jobs
            </Link>
            <Link
              to="/saved-jobs"
              className={`font-medium transition-colors hover:text-purple-600 flex items-center gap-2 ${
                location.pathname === "/saved-jobs" ? "text-purple-600 font-semibold" : "text-gray-700"
              }`}
            >
              <Heart size={18} />
              Saved Jobs
            </Link>
            <Link
              to="/about-us"
              className={`font-medium transition-colors hover:text-purple-600 ${
                location.pathname === "/about-us" ? "text-purple-600 font-semibold" : "text-gray-700"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/privacy-policy"
              className={`font-medium transition-colors hover:text-purple-600 ${
                location.pathname === "/privacy-policy" ? "text-purple-600 font-semibold" : "text-gray-700"
              }`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/join-freelancer"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
            >
              Join as Freelancer
            </Link>
          </div>

          {/* Desktop Auth/User Section */}
          <div className="hidden lg:flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg p-2 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-right hidden md:block">
                    <p className="font-semibold text-gray-900 text-sm">{getUserFirstName()}</p>
                    <p className="text-xs text-gray-500">Profile</p>
                  </div>
                  <Avatar className="w-10 h-10 border-2 border-purple-100">
                    <AvatarImage
                      src={
                        getProfilePicture() ||
                        `https://ui-avatars.com/api/?name=${getUserInitials()}&background=7c3aed&color=fff`
                      }
                      alt={user?.fullname}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-5">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                      <Avatar className="w-12 h-12 border-2 border-purple-100">
                        <AvatarImage
                          src={
                            getProfilePicture() ||
                            `https://ui-avatars.com/api/?name=${getUserInitials()}&background=7c3aed&color=fff`
                          }
                          alt={user?.fullname}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-lg">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{user?.fullname}</h4>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        <p className="text-xs text-purple-600 font-medium capitalize mt-1">{user?.role}</p>
                      </div>
                    </div>

                    {/* Role-based links */}
                    <div className="flex flex-col gap-1 py-2">
                      {user?.role === "Freelancer" && (
                        <>
                          <button
                            onClick={goToDashboard}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          >
                            <LayoutDashboard size={18} />
                            Dashboard
                          </button>
                          <button
                            onClick={goToProfile}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          >
                            <User2 size={18} />
                            Profile
                          </button>
                        </>
                      )}
                      {user?.role === "candidate" && (
                        <button
                          onClick={goToCandidateProfile}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <User2 size={18} />
                          View Profile
                        </button>
                      )}

                      {/* Logout */}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={logoutHandler}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {user ? (
              <Avatar className="w-9 h-9 border-2 border-purple-100">
                <AvatarImage
                  src={
                    getProfilePicture() ||
                    `https://ui-avatars.com/api/?name=${getUserInitials()}&background=7c3aed&color=fff`
                  }
                  alt={user?.fullname}
                  className="object-cover"
                />
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} className="animate-in fade-in" /> : <Menu size={24} className="animate-in fade-in" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen
            ? "max-h-screen opacity-100 bg-white border-t border-gray-100 shadow-lg"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {/* User info */}
          {user && (
            <div className="flex items-center space-x-3 px-4 py-3 bg-purple-50 rounded-lg mb-4">
              <Avatar className="w-14 h-14 border-2 border-white">
                <AvatarImage
                  src={
                    getProfilePicture() ||
                    `https://ui-avatars.com/api/?name=${getUserInitials()}&background=7c3aed&color=fff`
                  }
                  alt={user?.fullname}
                  className="object-cover"
                />
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{user?.fullname}</p>
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                <p className="text-xs text-purple-600 font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-col space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${location.pathname === "/" ? "bg-purple-50 text-purple-600" : "hover:bg-gray-50 text-gray-700"}`}><Home size={18}/>Home</Link>
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${location.pathname === "/jobs" ? "bg-purple-50 text-purple-600" : "hover:bg-gray-50 text-gray-700"}`}><Briefcase size={18}/>Jobs</Link>
            <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${location.pathname === "/browse" ? "bg-purple-50 text-purple-600" : "hover:bg-gray-50 text-gray-700"}`}><Search size={18}/>Browse</Link>
            <Link to="/saved-jobs" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${location.pathname === "/saved-jobs" ? "bg-purple-50 text-purple-600" : "hover:bg-gray-50 text-gray-700"}`}><Heart size={18}/>Saved Jobs</Link>
            <Link to="/about-us" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === "/about-us" ? "bg-purple-50 text-purple-600" : "hover:bg-gray-50 text-gray-700"}`}>About Us</Link>
            <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === "/privacy-policy" ? "bg-purple-50 text-purple-600" : "hover:bg-gray-50 text-gray-700"}`}>Privacy Policy</Link>
            <Link to="/join-freelancer" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold text-center hover:from-purple-700 hover:to-purple-900 transition-all">Join as Freelancer</Link>
          </div>

          {/* Auth buttons for mobile */}
          {!user ? (
            <div className="pt-4 space-y-3 border-t border-gray-100">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-center border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">Login</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-center bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all">Sign Up</Link>
            </div>
          ) : (
            <div className="pt-4 space-y-3 border-t border-gray-100">
              {user?.role === "Freelancer" && (
                <>
                  <button onClick={() => {goToDashboard(); setMobileMenuOpen(false)}} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium hover:bg-gray-50 text-gray-700"><LayoutDashboard size={18}/>Dashboard</button>
                  <button onClick={() => {goToProfile(); setMobileMenuOpen(false)}} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium hover:bg-gray-50 text-gray-700"><User2 size={18}/>Profile</button>
                </>
              )}
              {user?.role === "candidate" && (
                <button onClick={() => {goToCandidateProfile(); setMobileMenuOpen(false)}} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium hover:bg-gray-50 text-gray-700"><User2 size={18}/>View Profile</button>
              )}
              <button onClick={() => {logoutHandler(); setMobileMenuOpen(false)}} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"><LogOut size={18}/>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
