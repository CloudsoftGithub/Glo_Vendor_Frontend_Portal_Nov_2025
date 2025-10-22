'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function CustomerSignup() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    msisdn: '',
    password: '',
  })
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    setSubmitting(true)

    try {
      const response = await api.createCustomer({
        fullName: form.fullName,
        email: form.email,
        msisdn: form.msisdn,
        password: form.password,
      })

      if (response.id || response.email) {
        alert('🎉 Account created successfully! Please log in.')
        router.push('/customer_login')
      } else {
        setMsg('❌ Failed to register. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setMsg('❌ Error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">📝 Customer Signup</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="msisdn"
          placeholder="Phone (11 digits)"
          value={form.msisdn}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          pattern="\d{11}"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 text-white rounded transition ${
            submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-3 text-sm text-center">
        Already have an account?{' '}
        <a href="/customer_login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>

      {msg && <p className="mt-3 text-sm text-red-600 text-center">{msg}</p>}
    </div>
  )
}
