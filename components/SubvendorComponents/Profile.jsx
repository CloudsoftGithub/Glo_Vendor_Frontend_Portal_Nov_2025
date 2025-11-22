'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

// Helper to format currency
const formatCurrency = (amount) => {
  if (!amount) return '₦0.00'
  const num = Number(amount)
  return num.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })
}

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Profile() {
  const [profile, setProfile] = useState(null)
  // 1. Add specific loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Reset states on new fetch
        setLoading(true)
        setError(null)

        const subvendorId = localStorage.getItem('subvendorId')
        
        if (!subvendorId) {
            throw new Error('No Subvendor ID found. Please log in again.')
        }

        const data = await api.getSubvendorById(subvendorId)
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        // 2. Capture the error message to display to the user
        setError(err.message || 'Failed to load profile data.')
      } finally {
        // 3. Ensure loading stops whether the request succeeds or fails
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // 4. Handle the Error State in UI
  if (error) {
    return (
      <div className="text-center py-10 text-red-600 bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
        <h3 className="font-bold text-lg">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-black"
        >
          Retry
        </button>
      </div>
    )
  }

  // 5. Handle Loading State
  if (loading) return <p className="text-center py-4">Loading profile...</p>
  
  // 6. Handle edge case: Not loading, no error, but profile is still null
  if (!profile) return <p className="text-center py-4">No profile data available.</p>

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Subvendor Profile</h2>
      <div className="space-y-3">
        <p>
          <strong>Business Name:</strong> {profile.businessName || '-'}
        </p>
        <p>
          <strong>Contact Person:</strong> {profile.contactPerson || '-'}
        </p>
        <p>
          <strong>Email:</strong> {profile.email || '-'}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone || '-'}
        </p>
        <p>
          <strong>Address:</strong> {profile.address || '-'}
        </p>
        <p>
          <strong>Wallet Balance:</strong>{' '}
          <span className="font-medium">{formatCurrency(profile.walletBalance)}</span>
        </p>
        <p>
          <strong>Created At:</strong> {formatDate(profile.createdAt)}
        </p>
        <p>
          <strong>Last Updated:</strong> {formatDate(profile.updatedAt)}
        </p>
        <p>
          <strong>Status:</strong> <span className="capitalize">{profile.status || 'Active'}</span>
        </p>
      </div>
    </div>
  )
}