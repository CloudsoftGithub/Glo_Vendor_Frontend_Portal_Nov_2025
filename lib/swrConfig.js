'use client';
import { SWRConfig } from 'swr';
import api from './api'; // ✅ now works

export function GlobalSWRProvider({ children }) {
  const fetcher = async (key) => {
    switch (key) {
      case 'dataplans':
        return api.listDataPlans();
      case 'payments':
        return api.listPayments();
      default:
        return api.listDataPlans(); // fallback
    }
  }

  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: true, shouldRetryOnError: true }}>
      {children}
    </SWRConfig>
  )
}
