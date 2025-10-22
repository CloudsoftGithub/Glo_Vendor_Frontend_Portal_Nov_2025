'use client';
import { useMemo } from 'react';
import api from './api';

/**
 * Custom hook to expose API functions in React components.
 * Example usage: const { adminLogin, listDataPlans } = useApi();
 */
export default function useApi() {
  // useMemo is optional, just for stability
  return useMemo(() => ({
    adminLogin: api.adminLogin,
    customerLogin: api.customerLogin,
    subvendorLogin: api.subvendorLogin,
    aggregatorLogin: api.aggregatorLogin,
    listPayments: api.listPayments,
    initPayment: api.initPayment,
    verifyPayment: api.verifyPayment,
    listWalletTransactions: api.listWalletTransactions,
    listWalletTransactionsByUser: api.listWalletTransactionsByUser,
    listDataPlans: api.listDataPlans,
    uploadDataPlans: api.uploadDataPlans,
    listSubvendors: api.listSubvendors,
    listAggregators: api.listAggregators,
    listCustomers: api.listCustomers
  }), []);
}
