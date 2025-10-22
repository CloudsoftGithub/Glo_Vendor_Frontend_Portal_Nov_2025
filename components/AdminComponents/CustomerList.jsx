'use client'
import useSWR from 'swr'
import api from '@/lib/api'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function CustomerList() {
  const { data: customers, error, isLoading } = useSWR('custs', api.listCustomers)

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Customers</h2>

        {/* 🌀 Loading State */}
        {isLoading && (
          <div className="text-gray-500 text-sm mb-2">Loading customers...</div>
        )}

        {/* ❌ Error State */}
        {error && (
          <div className="text-red-500 text-sm mb-2">
            Failed to load customers. Please try again later.
          </div>
        )}

        {/* ✅ Customers List */}
        <div className="bg-white rounded shadow p-4">
          {customers && Array.isArray(customers) && customers.length ? (
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="border-b font-medium bg-gray-50">
                <tr>
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">MSISDN</th>
                  <th className="py-2 px-3">Full Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-700 font-semibold">
                      {c.id || '—'}
                    </td>
                    <td className="py-2 px-3 font-medium text-gray-900">
                      {c.msisdn || '—'}
                    </td>
                    <td className="py-2 px-3">{c.fullName || '—'}</td>
                    <td className="py-2 px-3">{c.email || '—'}</td>
                    <td className="py-2 px-3 text-gray-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !isLoading && (
              <div className="text-sm text-gray-500">No customers found.</div>
            )
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
