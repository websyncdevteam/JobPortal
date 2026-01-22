import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/authContext";

export default function Jobs() {
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Filters ----
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState("");

  // ---- Pagination ----
  const [page, setPage] = useState(1);
  const limit = 9;

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/jobs`, {
        params: {
          q: query,
          location,
          salaryMin,
          salaryMax,
          skills,
          page,
          limit,
        },
      });

      setJobs(res.data.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* ---------- PAGE HEADING ---------- */}
        <h1 className="text-3xl font-bold mb-6">Find Your Next Opportunity</h1>

        {/* ---------- FILTER SECTION ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 p-4 bg-white shadow-sm rounded-xl border">

          <input
            type="text"
            placeholder="Search job title..."
            className="border p-2 rounded-md w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            className="border p-2 rounded-md w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="number"
            placeholder="Min Salary"
            className="border p-2 rounded-md w-full"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Salary"
            className="border p-2 rounded-md w-full"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
          />

          <input
            type="text"
            placeholder="Skills (comma separated)"
            className="border p-2 rounded-md w-full"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <button
            onClick={handleFilter}
            className="col-span-1 md:col-span-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>

        {/* ---------- LOADING ---------- */}
        {loading && <h2 className="text-center py-10">Loading jobs...</h2>}

        {/* ---------- ERROR ---------- */}
        {error && (
          <h2 className="text-center py-10 text-red-500">{error}</h2>
        )}

        {/* ---------- NO JOBS ---------- */}
        {!loading && !error && jobs.length === 0 && (
          <h2 className="text-center py-10 text-gray-600">
            No jobs match your filter.
          </h2>
        )}

        {/* ---------- JOB CARDS ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={job.company?.logo || "/default-company.png"}
                  alt="Company"
                  className="h-12 w-12 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company?.name}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-3">
                {job.description?.slice(0, 100)}...
              </p>

              <p className="text-sm text-gray-600">
                📍 <strong>{job.location}</strong>
              </p>

              <p className="text-sm text-gray-600">
                💰 ₹{job.salary}
              </p>

              <p className="text-xs mt-2 text-gray-500">
                Skills: {job.skills?.slice(0, 3).join(", ")}...
              </p>

              <Link
                to={`/description/${job._id}`}
                className="block mt-4 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        {/* ---------- PAGINATION ---------- */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={jobs.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
