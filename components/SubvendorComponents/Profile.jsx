'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

export default function Profile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const identifier = localStorage.getItem('glovendor_identifier')
        const data = await api.getSubvendorById(identifier)
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }
    fetchProfile()
  }, [])

  if (!profile) return <p>Loading profile...</p>

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Subvendor Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone || '-'}</p>
      <p><strong>Status:</strong> {profile.status || 'Active'}</p>
    </div>
  )
}
