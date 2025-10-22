'use client'

import useSWR from 'swr'
import { useState } from 'react'
import api, { getToken } from '@/lib/api'
import ProtectedRoute from '@/components/ProtectedRoute'
import { RefreshCw } from 'lucide-react'

export default function ManageDataPlans() {
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterService, setFilterService] = useState('ALL')
  const [sortBy, setSortBy] = useState('createdAt')

  // ✅ SWR Data Fetcher
  const fetcher = async () => {
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    return api.listDataPlans()
  }

  const { data: plans, error, isLoading, mutate } = useSWR('data_plans', fetcher)

  // ✅ File Upload Handler
  async function upload(e) {
    e.preventDefault()
    setMsg('')
    if (!file) return setMsg('Please choose a file')
    if (!getToken()) return setMsg('You must be logged in to upload')

    const fd = new FormData()
    fd.append('file', file)

    setUploading(true)
    try {
      const resText = await api.uploadDataPlans(fd)
      const message = typeof resText === 'string' ? resText : resText.message
      setMsg(message || '✅ Upload successful')
      await mutate() // Refresh data
      setFile(null)
    } catch (err) {
      console.error(err)
      setMsg(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // ✅ Filtering Logic
  const filteredPlans = (plans || []).filter((p) => {
    const statusMatch =
      filterStatus === 'ALL' ||
      (p.status && p.status.toLowerCase() === filterStatus.toLowerCase())

    const serviceMatch =
      filterService === 'ALL' ||
      (p.dataServices &&
        p.dataServices.toLowerCase().includes(filterService.toLowerCase()))

    return statusMatch && serviceMatch
  })

  // ✅ Sorting Logic
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (sortBy === 'price') return (a.basePrice || 0) - (b.basePrice || 0)
    if (sortBy === 'validity') return (a.validityDays || 0) - (b.validityDays || 0)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto mt-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold mb-3 md:mb-0">📡 Manage Data Plans</h2>

          <button
            onClick={() => mutate()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* ===================== Upload Section ===================== */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <form
            onSubmit={upload}
            className="flex flex-col md:flex-row items-start md:items-center gap-3"
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="border rounded p-2 text-sm"
            />
            <button
              type="submit"
              disabled={uploading}
              className={`px-4 py-2 text-white rounded ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>

          {msg && (
            <p
              className={`mt-2 text-sm ${
                msg.includes('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {msg}
            </p>
          )}
        </div>

        {/* ===================== Filters ===================== */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <label className="mr-2 text-sm font-medium">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div>
            <label className="mr-2 text-sm font-medium">Filter by Data Service:</label>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="ALL">All</option>
              {Array.from(
                new Set(plans?.map((p) => p.dataServices).filter(Boolean))
              ).map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mr-2 text-sm font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="createdAt">Date Created</option>
              <option value="price">Price</option>
              <option value="validity">Validity</option>
            </select>
          </div>
        </div>

        {/* ===================== Data Plans Table ===================== */}
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          {isLoading && <p>Loading data plans...</p>}
          {error && <p className="text-red-600">Failed to load: {error.message}</p>}

          {!isLoading && !error && (
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr className="border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Service</th>
                  <th className="p-2 text-left">Validity</th>
                  <th className="p-2 text-left">Price (₦)</th>
                  <th className="p-2 text-left">ERS ID</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2 text-left">Updated</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlans.length > 0 ? (
                  sortedPlans.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 font-medium">{p.id}</td>
                      <td className="p-2">{p.name || p.planName}</td>
                      <td className="p-2">{p.dataServices || '-'}</td>
                      <td className="p-2">{p.validityDays || '-'}</td>
                      <td className="p-2">{p.basePrice?.toLocaleString() || '-'}</td>
                      <td className="p-2">{p.ersPlanId || '-'}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            p.status?.toLowerCase() === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {p.status || 'N/A'}
                        </span>
                      </td>
                      <td className="p-2">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleString()
                          : '-'}
                      </td>
                      <td className="p-2">
                        {p.updatedAt
                          ? new Date(p.updatedAt).toLocaleString()
                          : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-center" colSpan={9}>
                      No data plans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
