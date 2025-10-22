'use client'

import { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/components/AuthProvider'
import api from '@/lib/api'

// Icons
import {
  Home,
  CreditCard,
  Wallet,
  Layers,
  Users,
  User,
  LogOut,
  ChevronDown,
  Menu,
  Activity,
  Clock,
} from 'lucide-react'

// Components
import WalletTransactions from '@/components/AdminComponents/WalletTransactions'
import PaymentForm from '@/components/PaymentForm'
import CustomerList from '@/components/AdminComponents/CustomerList'
import SubvendorDataPlan from '@/components/SubvendorComponents/SubvendorDataPlan'
import Profile from '@/components/SubvendorComponents/Profile'
import PaymentReceipt from '@/components/PaymentReceipt'


export default function SubvendorDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const { logout } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch subvendor data
  const { data: txns } = useSWR('subvendor_txns', api.listWalletTransactions)
  const { data: customers } = useSWR('subvendor_customers', api.listCustomers)
  const { data: dataPlans } = useSWR('subvendor_data_plans', api.listSubvendorDataPlans)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Content Renderer
  const renderContent = () => {
    switch (activeTab) {
      case 'WalletTransactions':
        return <WalletTransactions />
      case 'Funds Wallet':
        return <PaymentForm />
      case 'Customers':
        return <CustomerList />
      case 'DataPlans':
        return <SubvendorDataPlan />
      case 'PaymentReceipt': // ✅ Fixed
        return <PaymentReceipt /> // ✅ Fixed casing
      case 'Profile':
        return <Profile />
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Subvendor Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                <Wallet className="text-orange-500 mb-2" />
                <div className="text-3xl font-bold">{txns?.length || 0}</div>
                <div className="text-gray-500 mt-2 text-center">Wallet Transactions</div>
              </div>

              <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                <CreditCard className="text-green-600 mb-2" />
                <div className="text-3xl font-bold">{txns?.length || 0}</div>
                <div className="text-gray-500 mt-2 text-center">Payments</div>
              </div>

              <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                <Users className="text-blue-600 mb-2" />
                <div className="text-3xl font-bold">{customers?.length || 0}</div>
                <div className="text-gray-500 mt-2 text-center">Customers</div>
              </div>

              <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                <Layers className="text-indigo-500 mb-2" />
                <div className="text-3xl font-bold">{dataPlans?.length || 0}</div>
                <div className="text-gray-500 mt-2 text-center">Data Plans</div>
              </div>

              <div className="bg-white rounded shadow p-4 flex flex-col items-center col-span-2 md:col-span-4">
                <Activity className="text-purple-500 mb-2" />
                <div className="text-3xl font-bold">
                  {Math.floor(Math.random() * 90 + 10)}%
                </div>
                <div className="text-gray-500 mt-2 text-center">Performance</div>
              </div>
            </div>
          </div>
        )
    }
  }

  const tabs = [
    { name: 'Dashboard', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Funds Wallet', icon: <CreditCard className="w-4 h-4 mr-2" /> },
    { name: 'Customers', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'WalletTransactions', icon: <Wallet className="w-4 h-4 mr-2" /> },
    { name: 'PaymentReceipt', icon: <Clock className="w-4 h-4 mr-2" /> }, // ✅ Unified naming
    { name: 'DataPlans', icon: <Layers className="w-4 h-4 mr-2" /> },
    { name: 'Profile', icon: <User className="w-4 h-4 mr-2" /> },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r p-4 flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                activeTab === tab.name ? 'bg-gray-200 font-medium' : ''
              }`}
            >
              {tab.icon}
              {tab.name === 'WalletTransactions'
                ? 'Wallet Transactions'
                : tab.name === 'PaymentReceipt'
                ? 'Payment Receipt'
                : tab.name}
            </button>
          ))}

          {/* Dropdown */}
          <div className="relative mt-auto" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-2 mt-4 bg-gray-100 rounded hover:bg-gray-200"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span>Subvendor</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-white border rounded shadow-md z-10">
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    setActiveTab('Profile')
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-2 text-gray-500" /> View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="md:hidden flex items-center justify-between bg-white p-4 border-b">
            <h1 className="text-lg font-semibold">Subvendor Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <main className="flex-grow p-6 bg-gray-100 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
