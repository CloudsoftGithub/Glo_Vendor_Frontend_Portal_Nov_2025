// components/Navbar.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="font-extrabold text-2xl text-blue-600 cursor-pointer">
                GloVendor
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/admin_login" className="text-gray-700 hover:text-blue-600 font-medium">Admin Login</Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Aggregator Login</Link>
            <Link href="/customer_login" className="text-gray-700 hover:text-green-600 font-medium">Customer Login</Link>
            <Link href="/customer_signup" className="text-gray-700 hover:text-yellow-500 font-medium">Customer Signup</Link>
          </div>

          {/* Mobile Toggler */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center text-gray-700 focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden bg-white shadow-lg overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-2">
          <Link href="/admin_login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-medium">Admin Login</Link>
          <Link href="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-medium">Aggregator Login</Link>
          <Link href="/customer_login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 font-medium">Customer Login</Link>
          <Link href="/customer_signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-yellow-50 font-medium">Customer Signup</Link>
        </div>
      </div>
    </nav>
  );
}
