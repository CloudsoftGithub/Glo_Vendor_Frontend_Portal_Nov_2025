'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function PaymentForm() {
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('Wallet Funding')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ✅ Load logged-in user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user?.email) setEmail(user.email)
  }, [])

  // ✅ Initiate Paystack Payment
  async function initiatePayment(e) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (!email || !amount) {
        setMessage('❌ Please provide a valid email and amount.')
        setLoading(false)
        return
      }

      // 💾 Save current user info before redirect
      const token = localStorage.getItem('glovendor_token')
      const identifier = localStorage.getItem('glovendor_identifier')
      const role = localStorage.getItem('glovendor_role') || 'customer'

      localStorage.setItem(
        'user',
        JSON.stringify({ email, role, identifier, token })
      )

      // 🚀 API call to backend
      const payload = {
        email,
        amount: parseFloat(amount),
        purpose,
      }

      const res = await api.post('/api/payments/initiate', payload)
      console.log('✅ Paystack init response:', res.data)

      const authUrl =
        res?.data?.data?.authorization_url || res?.data?.authorization_url
      const reference =
        res?.data?.data?.reference || res?.data?.reference

      if (authUrl && reference) {
        localStorage.setItem('payment_reference', reference)
        setMessage('✅ Redirecting to Paystack...')
        window.location.href = authUrl
      } else {
        console.error('Invalid Paystack response:', res.data)
        setMessage('❌ Failed to get Paystack authorization link')
      }
    } catch (err) {
      console.error('Payment initiation failed:', err)
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'An unknown error occurred.'
      setMessage(`❌ Payment initiation failed: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          💳 Wallet Funding
        </h2>

        {/* 🧾 Status Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded text-white text-sm ${
              message.includes('❌') ? 'bg-red-500' : 'bg-green-600'
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={initiatePayment}
          className="bg-white shadow rounded-lg p-6 space-y-4"
        >
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
              min="100"
            />
          </div>

          {/* Purpose Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Payment Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Wallet Funding"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-medium transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => router.back()}
            className="text-blue-500 hover:underline text-sm"
          >
            ← Back
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
