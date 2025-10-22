'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState('pending')
  const [message, setMessage] = useState('Verifying your payment...')
  const [details, setDetails] = useState(null)

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference) {
      setStatus('error')
      setMessage('❌ No payment reference found in URL.')
      return
    }

    async function verifyPayment() {
      try {
        const res = await api.get(`/api/payments/verify/${reference}`)
        const data = res.data?.data || res.data

        console.log('✅ Payment verification response:', data)

        if (
          data?.status?.toUpperCase() === 'SUCCESS' ||
          data?.data?.status === 'success'
        ) {
          setStatus('success')
          setMessage('✅ Payment verified successfully!')
          setDetails(data)

          localStorage.setItem('last_payment_details', JSON.stringify(data))

          // 👤 Determine user role
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          const role = user?.role?.toLowerCase() || 'customer'

          const redirectMap = {
            aggregator: '/aggregator_dashboard',
            subvendor: '/subvendor_dashboard',
            customer: '/customer_dashboard',
          }

          const dashboardRoute = redirectMap[role] || '/dashboard'

          // ⏳ Redirect after short delay
          setTimeout(() => {
            router.push(dashboardRoute)
          }, 3500)
        } else {
          setStatus('failed')
          setMessage('⚠️ Payment not successful or still pending.')
          setDetails(data)
        }
      } catch (err) {
        console.error('❌ Payment verification error:', err)
        const errMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Payment verification failed.'
        setStatus('error')
        setMessage(`❌ ${errMsg}`)
      }
    }

    verifyPayment()
  }, [searchParams, router])

  // 🎨 UI feedback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        {status === 'pending' && (
          <>
            <div className="animate-spin mx-auto mb-4 border-4 border-blue-300 border-t-blue-600 rounded-full w-12 h-12"></div>
            <h2 className="text-lg font-medium text-gray-700">{message}</h2>
            <p className="text-gray-500 text-sm mt-2">Please wait...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-600 text-5xl mb-3">✅</div>
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
            <p className="text-gray-600 text-sm mb-4">
              Reference: <span className="font-mono">{details?.reference}</span>
            </p>
            <button
              onClick={() => router.push('/paymentReceipt')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              View & Print Receipt
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-yellow-500 text-5xl mb-3">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Return to Wallet
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-600 text-5xl mb-3">❌</div>
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
