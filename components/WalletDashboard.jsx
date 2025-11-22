"use client";

import { Toaster } from "react-hot-toast";
import { History, RefreshCw } from "lucide-react"; // Added for better UI icons

export default function WalletDashboard({
  walletBalance = 0,
  transactions = [],
  onRefresh,
  loading = false,
}) {
  /* ============================================================
   * Skeleton Row for Loading
   * ============================================================ */
  const SkeletonRow = () => (
    <tr className="animate-pulse border-b">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-3 py-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );

  /* ============================================================
   * Render Loading State
   * ============================================================ */
  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 border-b">Date</th>
                <th className="px-3 py-2 border-b">Type</th>
                <th className="px-3 py-2 border-b">Amount (₦)</th>
                <th className="px-3 py-2 border-b">Reference</th>
                <th className="px-3 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ============================================================
   * Render Main Wallet Dashboard
   * ============================================================ */
  return (
    <div className="p-6 max-w-5xl mx-auto relative">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          💰 Transaction History
        </h2>
        <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-sm font-bold text-lg">
          Balance: ₦{Number(walletBalance).toLocaleString()}
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-white shadow rounded-lg p-6 mt-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-700">Recent Activity</h3>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md transition border border-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>

        {/* ============================================================
            UPDATED EMPTY STATE LOGIC
           ============================================================ */}
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              No Transactions Found
            </h4>
            <p className="text-gray-500 mt-2 max-w-sm">
              Your history is empty. Transactions will appear here once a
              transaction is made.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-3 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-3 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount (₦)
                  </th>
                  <th className="px-3 py-3 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-3 py-3 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {txn.createdAt
                        ? new Date(txn.createdAt).toLocaleString("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                    <td className="px-3 py-3 text-sm whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          txn.txnType?.toLowerCase() === "funding"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {txn.txnType?.toLowerCase() === "funding"
                          ? "Funding"
                          : "Debit"}
                      </span>
                    </td>
                    <td
                      className={`px-3 py-3 text-sm font-bold whitespace-nowrap ${
                        txn.txnType?.toLowerCase() === "funding"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {txn.txnType?.toLowerCase() === "funding" ? "+" : "-"}₦
                      {Number(txn.amount).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-sm font-mono text-gray-500 whitespace-nowrap">
                      {txn.reference || "—"}
                    </td>
                    <td className="px-3 py-3 text-sm whitespace-nowrap">
                      {txn.status === "SUCCESS" ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          ✅ Success
                        </span>
                      ) : txn.status === "PENDING" ? (
                        <span className="flex items-center gap-1 text-yellow-600 font-medium">
                          ⏳ Pending
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          ❌ Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
