import { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/services/api"; // CHANGED: Use api instead of axios
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "@/context/authContext";

// Icons
import {
  Search,
  Download,
  Filter,
  MoreHorizontal,
  User,
  Briefcase,
  Shield,
  Zap,
  Trash2,
  Eye,
  RefreshCw,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Settings,
  Mail,
  Phone,
  Calendar,
  Star,
  Award,
  Crown,
  Sparkles,
  Target,
  BarChart3,
  TrendingUp
} from "lucide-react";

const PAGE_SIZE = 8;

const UserManager = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [roleDialog, setRoleDialog] = useState(null);
  const [quickActionUser, setQuickActionUser] = useState(null);
  const [userStats, setUserStats] = useState({
    total: 0,
    admins: 0,
    recruiters: 0,
    freelancers: 0,
    candidates: 0,
    active: 0,
    suspended: 0
  });

  // Enhanced role configuration with all options
  const roleConfig = {
    candidate: {
      label: "Candidate",
      icon: User,
      color: "bg-gray-50 text-gray-700 border-gray-200",
      description: "Can apply to jobs and track applications",
      badgeColor: "gray",
      canBecome: ["recruiter", "freelancer", "admin"]
    },
    recruiter: {
      label: "Recruiter", 
      icon: Briefcase,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      description: "Can post jobs and manage candidates",
      badgeColor: "blue",
      canBecome: ["candidate", "freelancer", "admin"]
    },
    freelancer: {
      label: "Freelancer",
      icon: Zap,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      description: "Can submit candidates and earn commissions",
      badgeColor: "purple",
      canBecome: ["candidate", "recruiter", "admin"]
    },
    admin: {
      label: "Administrator",
      icon: Shield,
      color: "bg-red-50 text-red-700 border-red-200",
      description: "Full system access and user management",
      badgeColor: "red",
      canBecome: ["candidate", "recruiter", "freelancer"]
    }
  };

  // Security check
  useEffect(() => {
    if (currentUser && !isAdmin) {
      toast.error("Access Denied");
    }
  }, [currentUser, isAdmin]);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // CHANGED: Use api service instead of axios
      const res = await api.get(`${USER_API_END_POINT}/all`);
      
      if (res.data.success) {
        const usersData = res.data.data || [];
        setUsers(usersData);
        
        const stats = {
          total: usersData.length,
          admins: usersData.filter(u => u.role === 'admin').length,
          recruiters: usersData.filter(u => u.role === 'recruiter').length,
          freelancers: usersData.filter(u => u.role === 'freelancer').length,
          candidates: usersData.filter(u => u.role === 'candidate').length,
          active: usersData.filter(u => !u.isSuspended).length,
          suspended: usersData.filter(u => u.isSuspended).length
        };
        setUserStats(stats);
      }
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [fetchUsers, isAdmin]);

  // Filter users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((user) => 
        statusFilter === "active" ? !user.isSuspended : user.isSuspended
      );
    }

    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      result = result.filter(
        (user) =>
          user?.fullname?.toLowerCase().includes(searchTerm) ||
          user?.email?.toLowerCase().includes(searchTerm) ||
          user?.phoneNumber?.includes(search)
      );
    }

    return result;
  }, [users, search, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filteredUsers, page]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const updateUserRole = async (userId, newRole, userData) => {
    if (!isAdmin) {
      toast.error("Admin access required");
      return;
    }

    if (userId === currentUser?._id && newRole !== "admin") {
      toast.error("Cannot remove your own admin access");
      return;
    }

    setUpdatingUser(userId);
    
    try {
      // CHANGED: Use api service instead of axios
      const res = await api.put(
        `${USER_API_END_POINT}/role/${userId}`,
        { role: newRole }
      );
      
      if (res.data.success) {
        toast.success(`🎉 ${userData.fullname} is now ${roleConfig[newRole].label}`);
        setRoleDialog(null);
        setQuickActionUser(null);
        await fetchUsers();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update role";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setUpdatingUser(null);
    }
  };

  const toggleUserStatus = async (userId, currentStatus, userData) => {
    if (!isAdmin || userId === currentUser?._id) {
      toast.error("Cannot modify your own status");
      return;
    }

    setUpdatingUser(userId);
    
    try {
      // CHANGED: Use api service instead of axios
      const res = await api.put(
        `${USER_API_END_POINT}/${userId}/status`,
        { isSuspended: !currentStatus }
      );
      
      if (res.data.success) {
        toast.success(`✅ ${userData.fullname} ${!currentStatus ? 'suspended' : 'activated'}`);
        await fetchUsers();
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingUser(null);
    }
  };

  const deleteUser = async (userId) => {
    if (!isAdmin || userId === currentUser?._id) {
      toast.error("Cannot delete your own account");
      return;
    }

    setUpdatingUser(userId);
    
    try {
      // CHANGED: Use api service instead of axios
      const res = await api.delete(`${USER_API_END_POINT}/${userId}`);      
      if (res.data.success) {
        toast.success("✅ User deleted successfully");
        setDeleteConfirm(null);
        await fetchUsers();
      }
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setUpdatingUser(null);
    }
  };

  const exportToExcel = () => {
    const rows = filteredUsers.map((u) => ({
      Name: u.fullname || 'N/A',
      Email: u.email,
      Phone: u.phoneNumber || 'N/A',
      Role: roleConfig[u.role]?.label || u.role,
      Status: u.isSuspended ? 'Suspended' : 'Active',
      'Last Login': u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never',
      'Account Created': u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `users-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("📊 Excel export completed");
  };

  const getAvailableRoles = (currentUser) => {
    if (!currentUser) return [];
    
    const currentRole = currentUser.role;
    const config = roleConfig[currentRole];
    
    if (!config || !config.canBecome) return [];
    
    return config.canBecome.map(roleKey => ({
      value: roleKey,
      ...roleConfig[roleKey]
    }));
  };

  const getStatusBadge = (user) => {
    if (user.isSuspended) {
      return <Badge variant="destructive" className="text-xs">Suspended</Badge>;
    }
    
    if (user.lastLogin) {
      const lastLogin = new Date(user.lastLogin);
      const now = new Date();
      const daysSinceLogin = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLogin === 0) return <Badge variant="default" className="bg-green-100 text-green-700 text-xs">Online Today</Badge>;
      if (daysSinceLogin <= 7) return <Badge variant="outline" className="text-xs">Active This Week</Badge>;
    }
    
    return <Badge variant="outline" className="text-xs">Inactive</Badge>;
  };

  // Quick action handler
  const handleQuickAction = (user, action) => {
    if (action === 'change-role') {
      setRoleDialog(user);
    } else if (action === 'view-profile') {
      window.open(`/admin/users/${user._id}`, "_blank");
    } else if (action === 'toggle-status') {
      toggleUserStatus(user._id, user.isSuspended, user);
    } else if (action === 'delete') {
      setDeleteConfirm(user);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md text-center border-0 shadow-xl">
          <CardContent className="pt-12 pb-12">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Administrator Access Required</h2>
            <p className="text-gray-600 mb-8">This page is restricted to users with administrator privileges.</p>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white shadow-lg"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/70 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                <UserCheck className="h-6 w-6 text-gray-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
            </div>
            <p className="text-gray-600 text-lg">Manage user accounts, roles, and system access</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={fetchUsers} 
              variant="outline" 
              className="border-gray-300 rounded-xl shadow-sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={exportToExcel} 
              className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white shadow-lg rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
          {[
            { label: "Total Users", value: userStats.total, icon: User, color: "bg-white border-gray-200" },
            { label: "Admins", value: userStats.admins, icon: Shield, color: "bg-red-50 border-red-100" },
            { label: "Recruiters", value: userStats.recruiters, icon: Briefcase, color: "bg-blue-50 border-blue-100" },
            { label: "Freelancers", value: userStats.freelancers, icon: Zap, color: "bg-purple-50 border-purple-100" },
            { label: "Candidates", value: userStats.candidates, icon: UserCheck, color: "bg-gray-50 border-gray-100" },
            { label: "Active", value: userStats.active, icon: TrendingUp, color: "bg-green-50 border-green-100" },
            { label: "Suspended", value: userStats.suspended, icon: UserX, color: "bg-orange-50 border-orange-100" }
          ].map((stat, index) => (
            <Card key={index} className={`border shadow-sm ${stat.color} transition-all hover:shadow-md`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl shadow-xs">
                    <stat.icon className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Filters */}
        <Card className="bg-white border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-gray-300 rounded-xl h-12"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full lg:w-48 border-gray-300 rounded-xl h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="recruiter">Recruiters</SelectItem>
                  <SelectItem value="freelancer">Freelancers</SelectItem>
                  <SelectItem value="candidate">Candidates</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48 border-gray-300 rounded-xl h-12">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active only</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Users List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading user data...</p>
              </div>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <Card className="text-center py-16 border-0 shadow-sm">
              <CardContent>
                <UserX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            paginatedUsers.map((user) => {
              const config = roleConfig[user.role] || roleConfig.candidate;
              const IconComponent = config.icon;
              const availableRoles = getAvailableRoles(user);
              
              return (
                <Card key={user._id} className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          {user.profile?.profilePhoto ? (
                            <img
                              src={`/uploads/${user.profile.profilePhoto}`}
                              alt={user.fullname}
                              className="h-14 w-14 rounded-2xl object-cover shadow-sm"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-sm">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg truncate">{user.fullname}</h3>
                            {getStatusBadge(user)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            {user.phoneNumber && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{user.phoneNumber}</span>
                              </div>
                            )}
                          </div>

                          {/* Role Badge */}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={`${config.color} text-xs font-medium`}>
                              <IconComponent className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            {user.role === 'admin' && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                System Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Change Role Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRoleDialog(user)}
                          disabled={updatingUser === user._id || availableRoles.length === 0}
                          className="rounded-xl border-gray-300"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Change Role
                        </Button>

                        {/* Status Toggle */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user._id, user.isSuspended, user)}
                          disabled={updatingUser === user._id || user._id === currentUser?._id}
                          className={`rounded-xl ${
                            user.isSuspended 
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                              : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                          }`}
                        >
                          {user.isSuspended ? 'Activate' : 'Suspend'}
                        </Button>

                        {/* View Profile */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/admin/users/${user._id}`, "_blank")}
                          className="rounded-xl border-gray-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* More Actions Dropdown Replacement */}
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuickActionUser(quickActionUser?._id === user._id ? null : user)}
                            className="rounded-xl border-gray-300"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          
                          {/* Quick Actions Popover */}
                          {quickActionUser?._id === user._id && (
                            <div className="absolute right-0 top-12 z-10 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                              {availableRoles.map((role) => (
                                <button
                                  key={role.value}
                                  onClick={() => updateUserRole(user._id, role.value, user)}
                                  disabled={updatingUser === user._id}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <role.icon className="h-4 w-4" />
                                  <span>Make {role.label}</span>
                                </button>
                              ))}
                              <div className="border-t border-gray-200 my-1"></div>
                              <button
                                onClick={() => setDeleteConfirm(user)}
                                disabled={user._id === currentUser?._id}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete User</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{((page - 1) * PAGE_SIZE) + 1}-{Math.min(page * PAGE_SIZE, filteredUsers.length)}</span> of <span className="font-semibold">{filteredUsers.length}</span> users
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                variant="outline"
                className="rounded-xl border-gray-300"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                variant="outline"
                className="rounded-xl border-gray-300"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Role Change Dialog */}
      <Dialog open={!!roleDialog} onOpenChange={() => setRoleDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div>Change User Role</div>
                <DialogDescription className="text-base font-normal text-gray-600 mt-1">
                  Select a new role for {roleDialog?.fullname}
                </DialogDescription>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {getAvailableRoles(roleDialog).map((role) => (
              <button
                key={role.value}
                onClick={() => updateUserRole(roleDialog._id, role.value, roleDialog)}
                disabled={updatingUser === roleDialog?._id}
                className="w-full flex items-center gap-4 p-4 text-left rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
              >
                <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-xs">
                  <role.icon className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{role.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{role.description}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 transform -rotate-90" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-xl">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <div>Delete User Account</div>
                <DialogDescription className="text-base font-normal text-gray-600 mt-1">
                  This action cannot be undone
                </DialogDescription>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{deleteConfirm?.fullname}</strong>'s account?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              All user data, applications, and history will be permanently removed.
            </p>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteUser(deleteConfirm._id)}
              disabled={updatingUser === deleteConfirm?._id}
              className="flex-1 rounded-xl"
            >
              {updatingUser === deleteConfirm?._id ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close quick actions when clicking outside */}
      {quickActionUser && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setQuickActionUser(null)}
        />
      )}
    </div>
  );
};

export default UserManager;