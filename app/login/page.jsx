'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import api, { saveAuth } from '@/lib/api'

export default function AggregatorSubvendorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('AGGREGATOR')
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  async function submit(e) {
    e.preventDefault()
    setMsg('')

    try {
      let response

      if (role === 'AGGREGATOR') {
        response = await api.aggregatorLogin({ email, password })
      } else if (role === 'SUBVENDOR') {
        response = await api.subvendorLogin({ email, password })
      }

      const token = response?.token || response?.data?.token
      if (!token) {
        setMsg('Login failed: invalid credentials')
        return
      }

      const userIdentifier = response?.email || email

      // ✅ Save token
      saveAuth(token, { identifier: userIdentifier, role })
      login(token, { identifier: userIdentifier, role })

      alert(`Login successful! Welcome ${userIdentifier}`)

      // ✅ Route by role
      if (role === 'AGGREGATOR') {
        router.push('/aggregator_dashboard')
      } else if (role === 'SUBVENDOR') {
        router.push('/subvendor_dashboard')
      }
    } catch (err) {
      console.error(err)
      setMsg('Login failed: server error')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Aggregator / Subvendor Login
      </h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            className="p-2 border rounded w-1/2"
          >
            <option value="AGGREGATOR">Aggregator</option>
            <option value="SUBVENDOR">Subvendor</option>
          </select>
          <button
            type="submit"
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </form>
      {msg && <p className="mt-3 text-sm text-red-600 text-center">{msg}</p>}
    </div>
  )
}
