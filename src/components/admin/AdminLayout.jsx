// src/components/admin/AdminLayout.jsx - EXTREMELY RESPONSIVE + DARK THEME
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Users, 
  Building, 
  Briefcase, 
  BarChart3,
  UserCog,
  Shield,
  Menu,
  X,
  Home,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Sun,
  Moon,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser, selectIsAdmin } from '@/redux/authSlice';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentDevice, setCurrentDevice] = useState('desktop');

  // Detect device type and auto-adapt layout
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentDevice('mobile');
        setSidebarOpen(false);
      } else if (width < 1024) {
        setCurrentDevice('tablet');
        setSidebarOpen(false);
      } else {
        setCurrentDevice('desktop');
        setSidebarOpen(true);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    if (currentDevice === 'mobile' || currentDevice === 'tablet') {
      setMobileSidebarOpen(false);
    }
  }, [location.pathname, currentDevice]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Security check - redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      console.warn('Non-admin user accessed admin layout:', user.email);
      toast.error('Admin access required');
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`${darkMode ? 'Light' : 'Dark'} mode activated`);
  };

  // Navigation items
  const navItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      description: 'Overview and analytics'
    },
    { 
      path: '/admin/users', 
      label: 'Users', 
      icon: <Users size={20} />,
      description: 'Manage all users'
    },
    { 
      path: '/admin/companies', 
      label: 'Companies', 
      icon: <Building size={20} />,
      description: 'Manage company accounts'
    },
    { 
      path: '/admin/jobs', 
      label: 'Jobs', 
      icon: <Briefcase size={20} />,
      description: 'View and manage all jobs'
    },
    { 
      path: '/admin/recruiters', 
      label: 'Recruiters', 
      icon: <UserCog size={20} />,
      description: 'Recruiter management'
    },
  ];

  const quickActions = [
    {
      path: '/admin/jobs/create',
      label: 'Post Job',
      icon: <Plus size={16} />,
    },
    {
      path: '/admin/companies/create',
      label: 'Add Company',
      icon: <Plus size={16} />,
    },
    {
      path: '/admin/users/create',
      label: 'Add User',
      icon: <Plus size={16} />,
    }
  ];

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem?.label || 'Admin Panel';
  };

  // Check if a path is active
  const isPathActive = (path) => {
    return location.pathname === path;
  };

  // Device icon mapping
  const getDeviceIcon = () => {
    switch (currentDevice) {
      case 'mobile': return <Smartphone size={14} />;
      case 'tablet': return <Tablet size={14} />;
      default: return <Monitor size={14} />;
    }
  };

  // Render loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Render access denied if not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Admin privileges required to access this area.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-8 rounded-lg transition-all duration-200 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Extremely Responsive */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${currentDevice === 'mobile' ? 'w-11/12 max-w-xs' : 
          currentDevice === 'tablet' ? 'w-80' : 'w-64'}
        bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col border-r border-gray-200 dark:border-gray-700
      `}>
        
        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Admin</h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Control Panel</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-blue-100 dark:border-gray-600">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
              {user.fullname?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.fullname || 'Admin User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
          {navItems.map(({ path, label, icon, description }) => {
            const isActive = isPathActive(path);
            return (
              <NavLink
                key={path}
                to={path}
                className={`
                  flex items-center space-x-3 p-2 sm:px-3 sm:py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
                title={description}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                  {icon}
                </div>
                <span className="text-sm font-medium flex-1">{label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
            Quick Actions
          </p>
          <div className="space-y-1">
            {quickActions.map(({ path, label, icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `
                  flex items-center space-x-2 p-2 text-sm rounded-lg transition-colors group
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {icon}
                <span className="text-xs sm:text-sm">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Theme Toggle & Logout */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-2 w-full p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full p-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-colors group"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Top Navigation Bar - Extremely Responsive */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-30">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
            
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu size={18} />
              </button>
              
              {/* Page Title */}
              <div className="flex items-center space-x-3">
                <div className="lg:hidden w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
                    {getCurrentPageTitle()}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden xs:block">
                    Welcome back, {user.fullname?.split(' ')[0] || 'Admin'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              
              {/* Device Indicator - Mobile Only */}
              <div className="xs:hidden flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                {getDeviceIcon()}
              </div>

              {/* Search Bar - Responsive */}
              <div className="hidden xs:block relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-32 sm:w-48 md:w-64 transition-all"
                  />
                </div>
              </div>

              {/* Theme Toggle - Mobile */}
              <button
                onClick={toggleDarkMode}
                className="xs:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                    {user.fullname?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullname?.split(' ')[0] || 'Admin'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-500 dark:text-gray-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.fullname}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    {/* Theme Toggle in Dropdown */}
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                      <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800/30 p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Content Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{getCurrentPageTitle()}</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
                    Manage and monitor your platform efficiently
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Device Info - Tablet & Desktop */}
                  <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                    {getDeviceIcon()}
                    <span className="capitalize">{currentDevice}</span>
                  </div>
                  
                  {/* Add any action buttons here */}
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Close dropdown when clicking outside */}
      {userDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;