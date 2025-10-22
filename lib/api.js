/* ============================================================
 * 🌐 GloVendor API Utility (Axios Version)
 * ------------------------------------------------------------
 * Optimized for Spring Boot + Paystack integration
 * Payments map directly to WalletTransaction and Transaction.
 * ============================================================ */

'use client'
import axios from "axios";

/* ============================================================
 * ⚙️ BASE CONFIG
 * ============================================================ */
const BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:8080";

/* ============================================================
 * 🔐 AUTH HELPERS
 * ============================================================ */
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("glovendor_token");
}

export function getIdentifier() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("glovendor_identifier");
}

export function getRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("glovendor_role");
}

export function saveAuth(token, { identifier, role }) {
  if (typeof window === "undefined") return;
  localStorage.setItem("glovendor_token", token);
  localStorage.setItem("glovendor_identifier", identifier);
  localStorage.setItem("glovendor_role", role);
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("glovendor_token");
  localStorage.removeItem("glovendor_identifier");
  localStorage.removeItem("glovendor_role");
  window.location.href = "/login";
}

/* ============================================================
 * 🚀 AXIOS INSTANCE
 * ============================================================ */
const axiosInstance = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================================
 * 🔄 INTERCEPTORS
 * ============================================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ [API ERROR]:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ============================================================
 * 📤 FILE UPLOAD HELPER
 * ============================================================ */
async function uploadDataPlans(formData) {
  const token = getToken();
  if (!token) throw new Error("Authentication required.");

  const res = await axiosInstance.post("/api/data_plans/upload", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

/* ============================================================
 * 🧩 MAIN API METHODS
 * ============================================================ */
const GloVendorAPI = {
  /* -------- AUTH -------- */
  adminLogin: (data) => axiosInstance.post("/api/auth/login", data),
  aggregatorLogin: (data) => axiosInstance.post("/api/aggregators/auth/login", data),
  subvendorLogin: (data) => axiosInstance.post("/api/subvendor/auth/login", data),
  customerLogin: (data) => axiosInstance.post("/api/customers/auth/login", data),

  /* -------- AGGREGATORS -------- */
  listAggregators: async () => {
    const res = await axiosInstance.get("/api/aggregators");
    return Array.isArray(res.data) ? res.data : [];
  },
  createAggregator: (data) => axiosInstance.post("/api/aggregators/add", data),
  updateAggregator: (id, data) => axiosInstance.put(`/api/aggregators/${id}/update`, data),
  deleteAggregator: (id) => axiosInstance.delete(`/api/aggregators/${id}/delete`),
  getAggregatorById: (id) => axiosInstance.get(`/api/aggregators/${id}`),

  /* -------- SUBVENDORS -------- */
  listSubvendors: async () => {
    const res = await axiosInstance.get("/api/subvendor");
    return Array.isArray(res.data) ? res.data : [];
  },
  createSubvendor: (data) => axiosInstance.post("/api/subvendor/add", data),
  updateSubvendor: (id, data) => axiosInstance.put(`/api/subvendor/${id}/update`, data),
  deleteSubvendor: (id) => axiosInstance.delete(`/api/subvendor/${id}/delete`),
  getSubvendorById: (id) => axiosInstance.get(`/api/subvendor/${id}`),
  getSubvendorByEmail: (email) =>
    axiosInstance.get(`/api/subvendor/email/${encodeURIComponent(email)}`),

  /* -------- CUSTOMERS -------- */
  listCustomers: async () => {
    const res = await axiosInstance.get("/api/customer");
    return Array.isArray(res.data) ? res.data : [];
  },
  createCustomer: (data) => axiosInstance.post("/api/customer/add", data),
  updateCustomer: (id, data) => axiosInstance.put(`/api/customer/${id}/update`, data),
  deleteCustomer: (id) => axiosInstance.delete(`/api/customer/${id}/delete`),
  getCustomerById: (id) => axiosInstance.get(`/api/customer/${id}`),

  /* -------- DATA PLANS -------- */
  listDataPlans: async () => {
    const res = await axiosInstance.get("/api/data_plans");
    const plans = res.data;
    return Array.isArray(plans)
      ? plans.map((p) => ({
          id: p.id,
          name: p.planName || p.name,
          basePrice: p.priceNaira || p.price || 0,
          validityDays: p.validityDays || p.validity || 0,
          dataServices: p.dataServices,
          ersPlanId: p.ersPlanId,
          newPlan: p.newPlan,
          status: p.status || "INACTIVE",
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }))
      : [];
  },
  getDataPlanById: (id) => axiosInstance.get(`/api/data_plans/${id}`),
  createDataPlan: (data) => axiosInstance.post("/api/data_plans", data),
  updateDataPlan: (id, data) => axiosInstance.put(`/api/data_plans/${id}`, data),
  deleteDataPlan: (id) => axiosInstance.delete(`/api/data_plans/${id}`),
  uploadDataPlans,

  /* -------- SUBVENDOR DATA PLANS -------- */
  listSubvendorDataPlans: async () => {
    const token = getToken();
    if (!token) throw new Error("Please log in first.");

    let subvendorId = getIdentifier();

    if (isNaN(subvendorId)) {
      try {
        const subvendorRes = await GloVendorAPI.getSubvendorByEmail(subvendorId);
        const subvendor = subvendorRes.data;
        subvendorId = subvendor.id;
        localStorage.setItem("glovendor_identifier", subvendorId);
      } catch (err) {
        console.error("❌ Failed to resolve subvendor ID from email:", err.message);
        throw new Error("Failed to load subvendor plans. Please re-login.");
      }
    }

    const res = await axiosInstance.get(`/api/subvendor_plans/${subvendorId}`);
    const plans = res.data;
    return Array.isArray(plans)
      ? plans.map((p) => ({
          id: p.id,
          name: p.name,
          ersPlanId: p.ersPlanId,
          dataServices: p.dataServices,
          basePrice: p.basePrice,
          customPrice: p.customPrice,
          profit: (p.customPrice || 0) - (p.basePrice || 0),
          validityDays: p.validityDays,
          status: p.status,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }))
      : [];
  },

  updateSubvendorDataPlan: (id, payload) =>
    axiosInstance.put(`/api/subvendor_plans/${id}/price`, payload),

  deleteSubvendorDataPlan: (id) => axiosInstance.delete(`/api/subvendor_plans/${id}`),

  /* -------- PAYMENTS -------- */
  initiatePayment: (data) => axiosInstance.post("/api/payments/initiate", data),
  verifyPayment: (reference) =>
    axiosInstance.get(`/api/payments/verify/${encodeURIComponent(reference)}`),

  /* -------- WALLET TRANSACTIONS -------- */
  listWalletTransactions: async () => {
    const role = getRole();
    const identifier = getIdentifier();

    if (["SUPERADMIN", "ADMIN"].includes(role)) {
      const res = await axiosInstance.get("/api/wallet_transactions");
      return res.data;
    } else if (["AGGREGATOR", "SUBVENDOR", "CUSTOMER"].includes(role)) {
      const res = await axiosInstance.get(
        `/api/wallet_transactions/user/${encodeURIComponent(identifier)}`
      );
      return res.data;
    }
    return [];
  },
};

/* ============================================================
 * 📦 EXPORT DEFAULT
 * ============================================================ */
// ✅ Export an object that includes both axios instance and methods
export default Object.assign(axiosInstance, GloVendorAPI);
