// src/components/admin/UserProfilePage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api"; // <-- use the shared axios instance
import { toast } from "sonner";

/**
 * UserProfilePage
 * - mode="create" OR /admin/users/create (detects via pathname)
 * - supports create & edit (view) flows
 * - glassmorphism + gradient UI (Tailwind utility classes)
 */
const UserProfilePage = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isCreateMode = mode === "create" || location.pathname.endsWith("/create");

  // form state (for create & edit)
  const [user, setUser] = useState(
    isCreateMode
      ? { fullName: "", email: "", role: "Candidate", phoneNumber: "" }
      : null
  );

  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(!isCreateMode);
  const [errors, setErrors] = useState({});

  // small helper: validate minimal fields
  const validate = () => {
    const errs = {};
    if (!user?.fullName || user.fullName.trim().length < 2) errs.fullName = "Enter a valid full name";
    if (!user?.email || !/^\S+@\S+\.\S+$/.test(user.email)) errs.email = "Enter a valid email";
    return errs;
  };

  // ---- Fetch user only in edit mode ----
  const fetchUser = async () => {
    if (isCreateMode) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/users/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data.data);
        setNotes(res.data.data.adminNotes || "");
      } else {
        toast.error("User not found");
        navigate("/admin/users");
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error("Failed to fetch user profile");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCreateMode) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isCreateMode]);

  // ---- File URL helper ----
  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http")) return filePath;
    // For file URLs, use the base URL from api.defaults.baseURL
    const base = api.defaults.baseURL || 'https://www.backendserver.aim9hire.com/api/v1';
    if (filePath.startsWith("/uploads/")) return `${base}${filePath}`;
    if (filePath.includes("/uploads/")) {
      const filename = filePath.split("/uploads/").pop();
      return `${base}/uploads/${filename}`;
    }
    if (!filePath.includes("/")) return `${base}/uploads/${filePath}`;
    const filename = filePath.split("/").pop();
    return `${base}/uploads/${filename}`;
  };

  // ---- Create new user ----
  const handleCreateUser = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setUpdating(true);
      const res = await api.post(
        `/admin/users`,
        { ...user },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("User created successfully");
        navigate("/admin/users");
      } else {
        toast.error(res.data.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Create user error:", error);
      const msg = error.response?.data?.message || "Error creating user";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  // ---- Update single field for existing user ----
  const updateUserField = async (field, value) => {
    if (isCreateMode) {
      setUser((s) => ({ ...s, [field]: value }));
      return;
    }

    try {
      setUpdating(true);
      const res = await api.put(
        `/admin/users/${id}`,
        { [field]: value },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("User updated successfully");
        fetchUser();
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update error");
    } finally {
      setUpdating(false);
    }
  };

  // ---- Save admin notes ----
  const handleNotesSave = async () => {
    if (isCreateMode) {
      toast.error("Notes are available after creating the user");
      return;
    }
    await updateUserField("adminNotes", notes);
  };

  // ---- toggle suspension ----
  const toggleSuspend = async () => {
    if (!user) return;
    await updateUserField("isSuspended", !user.isSuspended);
  };

  // ---- delete user ----
  const handleDeleteUser = async () => {
    if (isCreateMode) return;
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

    try {
      const res = await api.delete(`/admin/users/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("User deleted successfully");
        navigate("/admin/users");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting user");
    }
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse max-w-xl">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        </div>
      </div>
    );
  }

  // ---- CREATE MODE UI ----
  if (isCreateMode) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* gradient background wrapper */}
          <div className="relative rounded-2xl overflow-hidden p-6"
               style={{
                 background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                 backdropFilter: "blur(10px)",
               }}>
            <div className="absolute inset-0 -z-10"
                 style={{
                   background: "linear-gradient(120deg, rgba(99,102,241,0.12), rgba(56,189,248,0.08))",
                   filter: "blur(40px)",
                   transform: "scale(1.2)",
                 }} />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Create New User</h2>
                <p className="text-sm text-white/80 mt-1">Add a user to your platform quickly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/90 font-medium">Full Name</label>
                <input
                  value={user.fullName}
                  onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  className="mt-2 w-full p-3 rounded-xl bg-white/10 placeholder-white/60 text-white outline-none border border-white/10 focus:border-white/30"
                  placeholder="Example: John Doe"
                />
                {errors.fullName && <div className="text-xs text-rose-400 mt-1">{errors.fullName}</div>}
              </div>

              <div>
                <label className="text-xs text-white/90 font-medium">Email</label>
                <input
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="mt-2 w-full p-3 rounded-xl bg-white/10 placeholder-white/60 text-white outline-none border border-white/10 focus:border-white/30"
                  placeholder="example@company.com"
                />
                {errors.email && <div className="text-xs text-rose-400 mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="text-xs text-white/90 font-medium">Phone Number</label>
                <input
                  value={user.phoneNumber}
                  onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                  className="mt-2 w-full p-3 rounded-xl bg-white/10 placeholder-white/60 text-white outline-none border border-white/10 focus:border-white/30"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="text-xs text-white/90 font-medium">Role</label>
                <select
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  className="mt-2 w-full p-3 rounded-xl bg-white/10 text-white outline-none border border-white/10"
                >
                  <option value="Candidate">Candidate</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <button
                onClick={() => navigate("/admin/users")}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/12"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateUser}
                disabled={updating}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold shadow-lg hover:opacity-95"
              >
                {updating ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- EDIT / VIEW MODE UI ----
  if (!user) {
    return <div className="p-6">User not found</div>;
  }

  const {
    fullName,
    email,
    role,
    isSuspended,
    phoneNumber,
    createdAt,
    lastLogin,
    profile,
    jobsPosted,
    applications,
  } = user;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden p-6"
             style={{
               background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
               backdropFilter: "blur(8px)",
             }}>
          <div className="absolute inset-0 -z-10"
               style={{
                 background: "linear-gradient(120deg, rgba(99,102,241,0.08), rgba(236,72,153,0.06))",
                 filter: "blur(30px)",
                 transform: "scale(1.15)",
               }} />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center text-2xl text-white font-semibold">
                {fullName?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">{fullName}</h2>
                <p className="text-sm text-white/80">{email}</p>
                <p className="text-xs text-white/70 mt-1">Role: <span className="font-medium">{role}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/users")}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white"
              >
                Back
              </button>

              <button
                onClick={toggleSuspend}
                className={`px-3 py-2 rounded-lg font-medium ${isSuspended ? "bg-green-600" : "bg-rose-500"} text-white`}
                disabled={updating}
              >
                {isSuspended ? "Reactivate" : "Suspend"}
              </button>

              <button
                onClick={handleDeleteUser}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white"
                disabled={updating}
              >
                Delete
              </button>
            </div>
          </div>

          {/* main grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Left column - Basic info */}
            <div className="col-span-2 bg-white/5 p-4 rounded-xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-3">Basic Info</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/80">Full Name</label>
                  <input
                    value={fullName}
                    onChange={(e) => updateUserField("fullName", e.target.value)}
                    className="mt-2 p-2 rounded-lg w-full bg-white/5 text-white border border-white/5"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/80">Email</label>
                  <input
                    value={email}
                    onChange={(e) => updateUserField("email", e.target.value)}
                    className="mt-2 p-2 rounded-lg w-full bg-white/5 text-white border border-white/5"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/80">Phone</label>
                  <input
                    value={phoneNumber || ""}
                    onChange={(e) => updateUserField("phoneNumber", e.target.value)}
                    className="mt-2 p-2 rounded-lg w-full bg-white/5 text-white border border-white/5"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/80">Role</label>
                  <select
                    value={role}
                    onChange={(e) => updateUserField("role", e.target.value)}
                    className="mt-2 p-2 rounded-lg w-full bg-white/5 text-white border border-white/5"
                  >
                    <option value="Candidate">Candidate</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Profile Photo */}
              {profile?.photo && (
                <div className="mt-4">
                  <label className="text-xs text-white/80">Profile Photo</label>
                  <div className="mt-2">
                    <img
                      src={getFileUrl(profile.photo)}
                      alt="Profile"
                      className="w-28 h-28 rounded-lg object-cover border border-white/8"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                </div>
              )}

              {/* Documents */}
              {profile?.documents?.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs text-white/80">Documents</label>
                  <ul className="mt-2 space-y-2">
                    {profile.documents.map((doc, idx) => (
                      <li key={idx}>
                        <a
                          href={getFileUrl(doc.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cyan-200 underline"
                        >
                          {doc.name || `Document ${idx + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right column - Admin notes & stats */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-3">Admin Notes</h3>
              <textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/5"
                placeholder="Internal notes (visible only to admins)"
              />
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleNotesSave}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold"
                  disabled={updating}
                >
                  Save Notes
                </button>

                <div className="text-xs text-white/70 ml-auto">
                  Joined: {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white">Activity</h4>
                <div className="text-xs text-white/70 mt-2">
                  Last login: {lastLogin ? new Date(lastLogin).toLocaleString() : "N/A"}
                </div>
              </div>

              {/* role-specific quick stats */}
              <div className="mt-6 space-y-3">
                {role === "Recruiter" && (
                  <div>
                    <h5 className="text-sm text-white/90 font-medium">Jobs Posted</h5>
                    <div className="text-sm text-white/70 mt-1">{jobsPosted?.length || 0}</div>
                  </div>
                )}

                {role === "Candidate" && (
                  <div>
                    <h5 className="text-sm text-white/90 font-medium">Applications</h5>
                    <div className="text-sm text-white/70 mt-1">{applications?.length || 0}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* bottom action row */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 rounded-lg bg-white/10 text-white"
            >
              Back to Users
            </button>
            <button
              onClick={() => updateUserField("role", role)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
