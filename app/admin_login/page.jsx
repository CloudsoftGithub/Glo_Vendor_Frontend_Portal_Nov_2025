'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import api, { saveAuth } from '@/lib/api' // ✅ import saveAuth

export default function Login() {
  const [identifier, setIdentifier] = useState('') // username or email
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('ADMIN')
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  async function submit(e) {
    e.preventDefault()
    setMsg('')

    try {
      let response

      // Call backend login for each role
      if (role === 'ADMIN') {
        response = await api.adminLogin({ username: identifier, password })
      } else if (role === 'CUSTOMER') {
        response = await api.customerLogin({ email: identifier, password })
      } else if (role === 'SUBVENDOR') {
        response = await api.subvendorLogin({ email: identifier, password })
      } else if (role === 'AGGREGATOR') {
        response = await api.aggregatorLogin({ email: identifier, password })
      }

      // Extract token from backend response
      const token = response?.token || response?.data?.token

      if (!token) {
        setMsg('Login failed: invalid credentials')
        return
      }

      // Extract user identifier (username or email) from backend
      const userIdentifier = response?.username || response?.email || identifier

      // ✅ Save token and user info in localStorage
      saveAuth(token, { identifier: userIdentifier, role })

      // ✅ Store token and user info in AuthProvider
      login(token, { identifier: userIdentifier, role })

      // Optional: show login successful alert
      alert(`Login successful! Welcome ${userIdentifier}`)

      // Redirect to dashboard or home page
      router.push('/admin_dashboard')
    } catch (err) {
      console.error(err)
      setMsg('Login failed: server error')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border rounded"
          >
            <option>ADMIN</option>
          </select>
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Login
          </button>
        </div>
      </form>
      {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
    </div>
  )
}
