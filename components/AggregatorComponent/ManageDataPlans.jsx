"use client";

import useSWR from "swr";
import { useState } from "react";
import api, { getToken } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RefreshCw, UploadCloud } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function ManageDataPlans() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Filters & Sorting
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL"); // Changed from Service to Category
  const [sortBy, setSortBy] = useState("createdAt");

  // ---------------- SWR Fetcher ----------------
  const fetcher = async () => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    return api.listDataPlans();
  };

  const {
    data: plans,
    error,
    isLoading,
    mutate,
  } = useSWR("data_plans", fetcher);

  // ---------------- Upload Handler ----------------
  async function handleUpload(e) {
    e.preventDefault();
    setMsg("");
    if (!file) return setMsg("⚠️ Please choose a file first.");
    if (!getToken()) return setMsg("You must be logged in to upload.");

    setUploading(true);
    setProgress(0);

    try {
      // Helper to simulate progress if your API wrapper doesn't support onUploadProgress natively
      // or pass it if your api.uploadDataPlans supports the config object
      const res = await api.uploadDataPlans(file, user?.email);

      if (res?.success || res?.uploaded) {
        setMsg(
          `✅ Uploaded ${res.uploaded || res.uploadedCount} plans successfully!`
        );
        await mutate(); // Refresh table
      } else {
        setMsg(`⚠️ ${res?.message || "Upload failed"}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMsg(err?.response?.data?.message || err.message || "❌ Upload failed");
    } finally {
      setUploading(false);
      setFile(null);
      setProgress(100);
      setTimeout(() => setProgress(0), 2000);
    }
  }

  // ---------------- Filtering ----------------
  const filteredPlans = (plans || []).filter((p) => {
    const statusMatch =
      filterStatus === "ALL" ||
      p.status?.toLowerCase() === filterStatus.toLowerCase();

    const categoryMatch =
      filterCategory === "ALL" ||
      p.category?.toLowerCase() === filterCategory.toLowerCase();

    return statusMatch && categoryMatch;
  });

  // ---------------- Sorting ----------------
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (sortBy === "price") return (a.price || 0) - (b.price || 0);
    if (sortBy === "validity") {
      // Attempt to parse the number out of the string (e.g. "30 Days" -> 30) for sorting
      const valA = parseInt(a.validity) || 0;
      const valB = parseInt(b.validity) || 0;
      return valA - valB;
    }
    // Default: Newest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Get unique categories for the dropdown
  const categories = Array.from(
    new Set(plans?.map((p) => p.category).filter(Boolean))
  );

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto mt-10 px-4">
        {/* ---------------- Header ---------------- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📡 Manage Data Plans
          </h2>
          <button
            onClick={() => mutate()}
            disabled={uploading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors shadow-sm"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </button>
        </div>

        {/* ---------------- Upload Section ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Upload New Plans
          </h3>
          <form
            onSubmit={handleUpload}
            className="flex flex-col md:flex-row items-start md:items-center gap-4"
          >
            <div className="flex-1 w-full md:w-auto">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer border rounded-lg p-2"
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !file}
              className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium transition-all ${
                uploading || !file
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </form>

          {/* Progress Bar (Visual Only) */}
          {uploading && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-500 animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          )}

          {/* Upload Message */}
          {msg && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                msg.includes("✅")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {msg}
            </div>
          )}
        </div>

        {/* ---------------- Filters & Controls ---------------- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="createdAt">Date Created (Newest)</option>
              <option value="price">Price (Low to High)</option>
              <option value="validity">Validity (Shortest to Longest)</option>
            </select>
          </div>
        </div>

        {/* ---------------- Table ---------------- */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Price (₦)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    ERS ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading && (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-8 text-center text-gray-500 animate-pulse"
                    >
                      Loading data...
                    </td>
                  </tr>
                )}

                {!isLoading && sortedPlans.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      No data plans found.
                    </td>
                  </tr>
                )}

                {sortedPlans.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {p.dataVolume || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {p.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {p.validity || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₦{p.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 text-xs">
                      {p.ersPlanId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          p.status?.toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-right text-xs text-gray-400">
          Total Records: {sortedPlans.length}
        </div>
      </div>
    </ProtectedRoute>
  );
}
