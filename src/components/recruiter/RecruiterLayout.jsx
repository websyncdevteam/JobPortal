import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/authSlice';
import { 
  Briefcase, 
  Users, 
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  Home,
  Settings,
  Bell,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import ThemeToggle from './ThemeToggle';

const RecruiterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/recruiter', icon: Home, exact: true },
    { name: 'Job Management', href: '/recruiter/jobs', icon: Briefcase },
    { name: 'Candidates', href: '/recruiter/candidates', icon: Users },
    { name: 'Interviews', href: '/recruiter/interviews', icon: Calendar },
    { name: 'Analytics', href: '/recruiter/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/recruiter/settings', icon: Settings },
  ];

  // Check if current route is active
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Close mobile sidebar
  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-xl transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        h-screen
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              {!sidebarCollapsed && (
                <span className="ml-2 text-xl font-bold text-gray-900 whitespace-nowrap">
                  Recruiter Portal
                </span>
              )}
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Collapse toggle for desktop */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* User info */}
        <div className={`p-4 border-b border-gray-200 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullname || 'Recruiter'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || 'recruiter@example.com'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileSidebar}
                className={`
                  group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
                title={sidebarCollapsed ? item.name : ''}
              >
                <Icon className={`
                  flex-shrink-0
                  ${active ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                  ${sidebarCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'}
                `} />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {active && !sidebarCollapsed && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-500"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Notifications */}
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">Notifications</span>
              </div>
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                3
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
            <ThemeToggle />
            {!sidebarCollapsed && (
              <span className="text-sm text-gray-500">Theme</span>
            )}
          </div>

          {/* Logout button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`
              w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200
              ${sidebarCollapsed ? 'justify-center px-2' : ''}
            `}
          >
            <LogOut className={`${sidebarCollapsed ? 'h-5 w-5' : 'mr-3 h-5 w-5'}`} />
            {!sidebarCollapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main content wrapper - This is the key fix */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 flex justify-between items-center">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                  {navigation.find(item => isActive(item.href, item.exact))?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  {location.pathname === '/recruiter' && 'Overview of your recruitment activities'}
                  {location.pathname === '/recruiter/jobs' && 'Manage job postings and applications'}
                  {location.pathname === '/recruiter/candidates' && 'View and manage candidate applications'}
                  {location.pathname === '/recruiter/interviews' && 'Schedule and manage interviews'}
                  {location.pathname === '/recruiter/analytics' && 'Recruitment analytics and insights'}
                  {location.pathname === '/recruiter/settings' && 'Account and application settings'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* User info on top bar */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullname || 'Recruiter'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role || 'Recruiter'}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Recruiter Portal. All rights reserved.</p>
              <div className="mt-2 md:mt-0 space-x-4">
                <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900">Terms of Service</a>
                <a href="#" className="hover:text-gray-900">Help Center</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RecruiterLayout;