'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import api, { saveAuth } from '@/lib/api'

export default function CustomerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')

    try {
      const response = await api.customerLogin({ email, password })
      const token = response?.token || response?.data?.token

      if (!token) {
        setMsg('❌ Invalid email or password')
        return
      }

      const userIdentifier = response?.email || email
      saveAuth(token, { identifier: userIdentifier, role: 'CUSTOMER' })
      login(token, { identifier: userIdentifier, role: 'CUSTOMER' })

      alert(`Welcome back, ${userIdentifier}!`)
      router.push('/customer_dashboard')
    } catch (err) {
      console.error(err)
      setMsg('❌ Login failed. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        👤 Customer Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-3 text-sm text-center">
        Don’t have an account?{' '}
        <a href="/customer_signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>

      {msg && <p className="mt-3 text-sm text-red-600 text-center">{msg}</p>}
    </div>
  )
}
