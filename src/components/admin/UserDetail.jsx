import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api"; // your axios instance
import { toast } from "react-toastify";

// API Base URL from environment or fallback to production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.backendserver.aim9hire.com';

export default function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/admin/user/${userId}`);
      setUser(res.data.user);
    } catch (err) {
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const toggleSuspend = async () => {
    try {
      await api.put(`/admin/user/suspend/${userId}`);
      toast.success("User suspension updated");
      fetchUser(); // refresh
    } catch (err) {
      toast.error("Error suspending user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="container">
      <h2>{user.fullname}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>
      <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</p>
      <p><strong>Suspended:</strong> {user.isSuspended ? "Yes" : "No"}</p>

      <button onClick={toggleSuspend}>
        {user.isSuspended ? "Unsuspend User" : "Suspend User"}
      </button>

      <hr />

      <h3>Profile</h3>
      {user.profile?.profilePhoto && (
        <img
          src={`${API_BASE_URL}/${user.profile.profilePhoto}`}
          alt="Profile"
          width="150"
        />
      )}
      <p><strong>Bio:</strong> {user.profile?.bio || "N/A"}</p>
      <p><strong>Skills:</strong> {user.profile?.skills?.join(", ") || "N/A"}</p>

      {user.profile?.resume && (
        <p>
          <strong>Resume:</strong>{" "}
          <a href={`${API_BASE_URL}/${user.profile.resume}`} target="_blank" rel="noopener noreferrer">Download</a>
        </p>
      )}

      {user.profile?.documents?.length > 0 && (
        <div>
          <strong>Documents:</strong>
          <ul>
            {user.profile.documents.map((doc, i) => (
              <li key={i}>
                <a href={`${API_BASE_URL}/${doc}`} target="_blank" rel="noopener noreferrer">Document {i + 1}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user.role === "recruiter" && (
        <>
          <hr />
          <h3>Jobs Posted</h3>
          <ul>
            {user.jobsPosted?.map((job) => (
              <li key={job._id}>
                <strong>{job.title}</strong> @ {job.companyName} ({job.status})
              </li>
            ))}
          </ul>
        </>
      )}

      {user.role === "candidate" && (
        <>
          <hr />
          <h3>Applications</h3>
          <ul>
            {user.applications?.map((app, index) => (
              <li key={index}>
                Job: {app.jobId?.title} @ {app.jobId?.companyName} - <strong>Status:</strong> {app.status}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
