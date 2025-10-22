'use client'
import Link from 'next/link'
import { useAuth } from './AuthProvider'

export default function Nav() {
  const { token, user, logout } = useAuth()

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold">GloVendor</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li><Link className="block p-2 rounded hover:bg-gray-100" href="/">Dashboard</Link></li>
          <li><Link className="block p-2 rounded hover:bg-gray-100" href="/ManagePayments">Payments</Link></li>
          <li><Link className="block p-2 rounded hover:bg-gray-100" href="/WalletTransactions">Wallet Transactions</Link></li>
          <li><Link className="block p-2 rounded hover:bg-gray-100" href="/ManageDataPlans">Data Plans</Link></li>
          <li><Link className="block p-2 rounded hover:bg-gray-100" href="/SubvendorList">Subvendors</Link></li>
          <li><Link className="block p-2 rounded hover:bg-gray-100" href="/ManageAggregetors">Aggregators</Link></li>
          <li><Link className="block p-2 rounded hover:bg-gray-100" href="/CustomerList">Customers</Link></li>
        </ul>
      </nav>

      <div className="p-4 border-t mt-auto">
        {token ? (
          <div>
            <div className="text-sm">Signed in as</div>
            <div className="font-medium">{user?.username || user?.email || 'User'}</div>
            <button onClick={logout} className="mt-2 w-full px-3 py-2 bg-red-600 text-white rounded">Logout</button>
          </div>
        ) : (
          <Link className="block px-3 py-2 bg-blue-600 text-white rounded text-center" href="/login">Login</Link>
        )}
      </div>
    </aside>
  )
}
