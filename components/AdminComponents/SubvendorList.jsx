'use client';
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SubvendorList() {
  const { data: subs, error, isLoading } = useSWR('subs', api.listSubvendors);

  // ✅ State for search term and field selection
  const [filterField, setFilterField] = useState('businessName');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Filtered subvendors based on selected field
  const filteredSubs = useMemo(() => {
    if (!subs || !Array.isArray(subs)) return [];
    if (!searchTerm) return subs;

    return subs.filter((s) => {
      const fieldValue = String(s[filterField] || '').toLowerCase();
      return fieldValue.includes(searchTerm.toLowerCase());
    });
  }, [subs, searchTerm, filterField]);

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Subvendors</h2>

        {/* 🔍 Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="businessName">Business Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${filterField
              .replace(/([A-Z])/g, ' $1')
              .toLowerCase()}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-64 text-sm"
          />
        </div>

        {/* 🌀 Loading State */}
        {isLoading && (
          <div className="text-gray-500 text-sm">Loading subvendors...</div>
        )}

        {/* ❌ Error State */}
        {error && (
          <div className="text-red-500 text-sm">
            Failed to load subvendors. Please try again later.
          </div>
        )}

        {/* ✅ Data List */}
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          {filteredSubs.length > 0 ? (
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="border-b font-medium bg-gray-50">
                <tr>
                  <th className="py-2 px-3">#ID</th>
                  <th className="py-2 px-3">Business Name</th>
                  <th className="py-2 px-3">Contact Person</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Address</th>
                  <th className="py-2 px-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-700">{s.id || '—'}</td>
                    <td className="py-2 px-3 font-medium text-gray-900">
                      {s.businessName || '—'}
                    </td>
                    <td className="py-2 px-3">
                      {s.contactPerson?.trim() || '—'}
                    </td>
                    <td className="py-2 px-3">{s.email || '—'}</td>
                    <td className="py-2 px-3">{s.phone || '—'}</td>
                    <td className="py-2 px-3">{s.address || '—'}</td>
                    <td className="py-2 px-3 text-gray-500">
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !isLoading && (
              <div className="text-sm text-gray-500">No subvendors found.</div>
            )
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
