'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ManageSubvendor() {
  // SWR fetch hook for subvendors
  const { data: subs, error, isLoading, mutate } = useSWR('subs', api.listSubvendors);

  // Modal visibility and form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await api.createSubvendor({
        businessName: form.businessName,
        contactPerson: form.contactPerson,
        email: form.email,
        address: form.address,
        phone: form.phone,
        passwordHash: form.password, // backend will hash internally
      });

      // Show success message
      setMessage('✅ Subvendor created successfully!');

      // Reset form
      setForm({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        password: '',
      });

      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        setMessage('');
      }, 1500);

      // Refresh subvendor list
      mutate();
    } catch (err) {
      console.error('Failed to create subvendor:', err);
      setMessage('❌ Failed to create subvendor. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Subvendors</h2>
          <button
            onClick={() => {
              setShowModal(true);
              setMessage('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Add Subvendor
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded text-center ${
              message.startsWith('✅')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        {/* Loading */}
        {isLoading && <p className="text-gray-500 text-sm">Loading subvendors...</p>}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">
            Failed to load subvendors. Please try again later.
          </p>
        )}

        {/* Subvendor Table */}
        <div className="bg-white rounded shadow p-4">
          {subs && Array.isArray(subs) && subs.length ? (
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="border-b font-medium bg-gray-50">
                <tr>
                  <th className="py-2 px-3">Business Name</th>
                  <th className="py-2 px-3">Contact Person</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Address</th>
                  <th className="py-2 px-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2 px-3 font-medium text-gray-900">
                      {s.businessName || '—'}
                    </td>
                    <td className="py-2 px-3">
                      {s.contactPerson?.trim() ? s.contactPerson : '—'}
                    </td>
                    <td className="py-2 px-3">{s.email || '—'}</td>
                    <td className="py-2 px-3">{s.phone || '—'}</td>
                    <td className="py-2 px-3">{s.address || '—'}</td>
                    <td className="py-2 px-3 text-gray-500">
                      {s.createdAt ? new Date(s.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !isLoading && <p className="text-sm text-gray-500">No subvendors found.</p>
          )}
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate-fadeIn">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>

              <h3 className="text-lg font-semibold mb-4">Add New Subvendor</h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Business Name"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  placeholder="Contact Person"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border p-2 rounded"
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-2 rounded text-white transition ${
                    submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {submitting ? 'Saving...' : 'Save Subvendor'}
                </button>
              </form>

              {message && (
                <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
