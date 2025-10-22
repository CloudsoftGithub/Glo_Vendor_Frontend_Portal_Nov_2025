'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { User, Mail, LogOut } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.identifier || 'Aggregator User',
    email: user?.email || 'aggregator@example.com',
  })

  const handleLogout = () => {
    logout()
    router.push('/aggregator_login')
  }

  const handleSave = () => {
    alert('Profile updated successfully!')
    setEditing(false)
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">Aggregator Profile</h1>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-gray-500" />
            <input
              type="text"
              className="border p-2 rounded w-full"
              disabled={!editing}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-gray-500" />
            <input
              type="email"
              className="border p-2 rounded w-full"
              disabled={!editing}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex justify-between mt-6">
            {editing ? (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
