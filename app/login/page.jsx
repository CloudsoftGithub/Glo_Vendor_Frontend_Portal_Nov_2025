"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import api, { saveAuth } from "@/lib/api";

export default function MultiRoleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AGGREGATOR"); // Default role
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading(`🔐 Logging in as ${role.toLowerCase()}...`);

    try {
      // 1. Clear any old session data immediately to prevent conflicts
      localStorage.removeItem("subvendorId");
      localStorage.removeItem("aggregatorId");
      localStorage.removeItem("retailerId");
      localStorage.removeItem("token");

      let response;

      switch (role) {
        case "AGGREGATOR":
          response = await api.aggregatorLogin({
            email: email.trim(),
            password,
          });
          break;
        case "SUBVENDOR":
          response = await api.subvendorLogin({
            email: email.trim(),
            password,
          });
          break;
        case "RETAILER":
          response = await api.retailerLogin({ email: email.trim(), password });
          break;
        default:
          throw new Error("Invalid login role selected");
      }

      const payload = response?.data || response;
      console.log("✅ Normalized payload:", payload);

      // -----------------------------------------------------------------
      // ✅ FIX: Improved Payload Extraction for Token and User ID
      // The payload?.user check is necessary for the Retailer login endpoint.
      // -----------------------------------------------------------------

      // 1. Extract Token
      const token =
        payload?.token || payload?.accessToken || payload?.access_token || null;

      // 2. Extract User Object (Check for role-specific keys and the generic 'user' key)
      const userObject =
        payload?.aggregator ||
        payload?.subvendor ||
        payload?.retailer ||
        payload?.user || // <--- ADDED: Checks for the 'user' key used by RetailerAuthController
        payload; // Fallback to the top-level payload

      // 3. Extract User Details
      const userId = userObject?.id || userObject?.identifier || null;

      const userEmail = userObject?.email || email;

      const userName = userObject?.name || userObject?.businessName || null;

      // -----------------------------------------------------------------
      // END FIX
      // -----------------------------------------------------------------

      if (token && userId) {
        // ✅ CRITICAL FIX: Save the specific ID key that Profile.jsx looks for
        if (role === "SUBVENDOR") {
          localStorage.setItem("subvendorId", userId);
        } else if (role === "AGGREGATOR") {
          localStorage.setItem("aggregatorId", userId);
        } else if (role === "RETAILER") {
          localStorage.setItem("retailerId", userId);
        }

        // Standard Auth Saving
        saveAuth(token, { id: userId, email: userEmail, name: userName, role });

        // Save generic user object
        localStorage.setItem(
          "user",
          JSON.stringify({ id: userId, email: userEmail, role })
        );
        localStorage.setItem("glovendor_role", role);

        // Update Context
        login(token, { id: userId, email: userEmail, name: userName, role });

        toast.success(`🎉 Welcome, ${userName || userEmail}!`, {
          id: toastId,
          duration: 2000,
        });

        // 🚀 Redirect
        let redirectRoute = "/";
        if (role === "AGGREGATOR") redirectRoute = "/aggregator_dashboard";
        else if (role === "SUBVENDOR") redirectRoute = "/subvendor_dashboard";
        else if (role === "RETAILER") redirectRoute = "/retailer_dashboard";

        console.log("🔁 Redirecting to:", redirectRoute);
        router.replace(redirectRoute);
      } else {
        throw new Error(
          "Login successful, but User ID or Token was missing from response."
        );
      }
    } catch (err) {
      console.error("🚨 Login error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An unexpected error occurred.";
      toast.error("❌ " + msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
        👤 Aggregator / Subvendor / Retailer Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <div className="flex gap-2 items-center">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border rounded w-1/2"
          >
            <option value="AGGREGATOR">Aggregator</option>
            <option value="SUBVENDOR">Subvendor</option>
            <option value="RETAILER">Retailer</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 px-3 py-2 text-white font-medium rounded transition ${
              submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
