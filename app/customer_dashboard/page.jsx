'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import api from '@/lib/api'

export default function CustomerDashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchWalletHistory() {
      try {
        const res = await api.listWalletTransactions()
        setTransactions(res || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load wallet transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchWalletHistory()
  }, [])

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">💼 Customer Dashboard</h2>

        {loading && <p>Loading your data...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>

            {transactions.length === 0 ? (
              <p>No transactions yet.</p>
            ) : (
              <table className="min-w-full table-auto border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Reference</th>
                    <th className="p-2 text-left">Amount (₦)</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.reference} className="border-t hover:bg-gray-50">
                      <td className="p-2">{txn.reference}</td>
                      <td className="p-2">{txn.amount?.toFixed(2)}</td>
                      <td className="p-2">{txn.txnType}</td>
                      <td
                        className={`p-2 ${
                          txn.status === 'SUCCESS'
                            ? 'text-green-600'
                            : txn.status === 'PENDING'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {txn.status}
                      </td>
                      <td className="p-2">
                        {txn.timestamp
                          ? new Date(txn.timestamp).toLocaleString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
