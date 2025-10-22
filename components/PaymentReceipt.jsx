'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import api from '@/lib/api'
import jsPDF from 'jspdf'

export default function PaymentReceiptPage() {
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const params = useSearchParams()
  const ref = params.get('ref') || localStorage.getItem('payment_reference')

  useEffect(() => {
    async function fetchReceipt() {
      try {
        if (!ref) {
          setError('No payment reference found')
          setLoading(false)
          return
        }

        const res = await api.verifyPayment(ref)
        const data = res?.data?.data || res?.data

        if (!data) {
          setError('Invalid payment verification response.')
          setLoading(false)
          return
        }

        // ✅ Use localStorage and fallback values
        const email =
          data.customer?.email || localStorage.getItem('last_payment_email')
        const amount =
          data.amount / 100 || localStorage.getItem('last_payment_amount')
        const purpose =
          data.metadata?.purpose ||
          localStorage.getItem('last_payment_purpose') ||
          'Wallet Funding'
        const role = localStorage.getItem('user_role') || 'CUSTOMER'

        setReceipt({
          email,
          amount,
          purpose,
          reference: data.reference || ref,
          role,
          status: data.status || 'SUCCESS',
          date:
            data.paidAt ||
            data.payment_date ||
            new Date().toLocaleString(),
        })

        setLoading(false)
      } catch (err) {
        console.error('❌ Receipt error:', err)
        setError('Failed to load payment receipt: ' + err.message)
        setLoading(false)
      }
    }

    fetchReceipt()
  }, [ref])

  // ✅ Generate PDF
  function downloadPDF() {
    if (!receipt) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(20)
    doc.text('Payment Receipt', pageWidth / 2, 25, { align: 'center' })

    doc.setFontSize(12)
    doc.text(`Date: ${receipt.date}`, 14, 45)
    doc.line(14, 50, pageWidth - 14, 50)

    const info = [
      ['Email:', receipt.email],
      ['Amount:', `₦${parseFloat(receipt.amount).toLocaleString()}`],
      ['Purpose:', receipt.purpose],
      ['Reference:', receipt.reference],
      ['Role:', receipt.role],
      ['Status:', receipt.status],
    ]

    let y = 60
    info.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold')
      doc.text(label, 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(String(value || '-'), 60, y)
      y += 10
    })

    doc.line(14, y + 4, pageWidth - 14, y + 4)
    doc.setFontSize(11)
    doc.text('Thank you for your payment.', 14, y + 15)

    doc.save(`Receipt_${receipt.reference}.pdf`)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-700 text-lg font-medium animate-pulse">
            ⏳ Loading your payment receipt...
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">❌ Payment Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-3xl font-semibold text-green-600 mb-4 text-center">
            ✅ Payment Successful
          </h2>

          <p className="text-center text-gray-600 mb-6">
            Your wallet has been funded successfully.
          </p>

          <div className="space-y-3 text-gray-800">
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{receipt.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>₦{parseFloat(receipt.amount).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Purpose:</span>
              <span>{receipt.purpose}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Reference:</span>
              <span className="text-sm text-gray-600">{receipt.reference}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Role:</span>
              <span>{receipt.role}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{receipt.date}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              📄 Download PDF
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/payment')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
